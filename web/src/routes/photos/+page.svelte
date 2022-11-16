<script lang="ts">
	import NavigationBar from '$lib/components/shared-components/navigation-bar.svelte';
	import SideBar from '$lib/components/shared-components/side-bar/side-bar.svelte';
	import AssetGrid from '$lib/components/photos-page/asset-grid.svelte';
	import ContextMenu from '$lib/components/shared-components/context-menu/context-menu.svelte';
	import MenuOption from '$lib/components/shared-components/context-menu/menu-option.svelte';
	import AlbumSelectionModal from '$lib/components/shared-components/album-selection-modal.svelte';
	import { downloadAssets } from '$lib/stores/download';
	import { goto } from '$app/navigation';

	import type { PageData } from './$types';

	import { openFileUploadDialog, UploadType } from '$lib/utils/file-uploader';
	import {
		assetInteractionStore,
		isMultiSelectStoreState,
		selectedAssets
	} from '$lib/stores/asset-interaction.store';
	import ControlAppBar from '$lib/components/shared-components/control-app-bar.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import CircleIconButton from '$lib/components/shared-components/circle-icon-button.svelte';
	import DeleteOutline from 'svelte-material-icons/DeleteOutline.svelte';
	import FolderDownloadOutline from 'svelte-material-icons/FolderDownloadOutline.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import { AlbumResponseDto, api, AssetResponseDto } from '@api';
	import {
		notificationController,
		NotificationType
	} from '$lib/components/shared-components/notification/notification';
	import { assetStore } from '$lib/stores/assets.store';
	import { AxiosRequestConfig, AxiosResponse } from 'axios';

	export let data: PageData;

	interface Downloadable {
		getFilename: (count: number) => string;
		makeRequest: (skip: number, config: AxiosRequestConfig) => Promise<AxiosResponse<void, any>>;
	}

	const deleteSelectedAssetHandler = async () => {
		try {
			if (
				window.confirm(
					`Caution! Are you sure you want to delete ${$selectedAssets.size} assets? This step also deletes assets in the album(s) to which they belong. You can not undo this action!`
				)
			) {
				const { data: deletedAssets } = await api.assetApi.deleteAsset({
					ids: Array.from($selectedAssets).map((a) => a.id)
				});

				for (const asset of deletedAssets) {
					if (asset.status == 'SUCCESS') {
						assetStore.removeAsset(asset.id);
					}
				}

				assetInteractionStore.clearMultiselect();
			}
		} catch (e) {
			notificationController.show({
				type: NotificationType.Error,
				message: 'Error deleting assets, check console for more details'
			});
			console.error('Error deleteSelectedAssetHandler', e);
		}
	};

	const removeDownload = (fileName: string) => {
		setTimeout(() => {
			const copy = $downloadAssets;
			delete copy[fileName];
			$downloadAssets = copy;
		}, 2000);
	};

	const finishDownload = (fileName: string, blob: Blob | void) => {
		if (!(blob instanceof Blob)) {
			return;
		}

		const fileUrl = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = fileUrl;
		anchor.download = fileName;

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);

		URL.revokeObjectURL(fileUrl);

		removeDownload(fileName);
	};

	const startDownload = async (config: Downloadable) => {
		let fileName = 'archive.zip';
		let skip = 0;
		let count = 0;
		let done = false;

		try {
			while (!done) {
				count++;
				fileName = config.getFilename(count);

				$downloadAssets[fileName] = 0;

				const axiosConfig: AxiosRequestConfig = {
					responseType: 'blob',
					onDownloadProgress: function (progressEvent) {
						const request = this as XMLHttpRequest;

						let total = 0;
						if (progressEvent.lengthComputable) {
							total = progressEvent.total;
						}

						const headerHint = request.getResponseHeader('X-Immich-Content-Length-Hint');
						if (headerHint) {
							total = Number(headerHint) || 0;
						}

						if (total) {
							const current = progressEvent.loaded;
							$downloadAssets[fileName] = Math.floor((current / total) * 100);
						}
					}
				};

				const { data, status, headers } = await config.makeRequest(skip, axiosConfig);

				const isNotComplete = headers['x-immich-archive-complete'] === 'false';
				const fileCount = Number(headers['x-immich-archive-file-count']) || 0;
				if (isNotComplete && fileCount > 0) {
					skip += fileCount;
				} else {
					done = true;
				}

				if (status === 200) {
					finishDownload(fileName, data);
				}
			}

			return true;
		} catch (e) {
			removeDownload(fileName);
			console.error('Error downloading file ', e);
			notificationController.show({
				type: NotificationType.Error,
				message: 'Error downloading file, check console for more details.'
			});
			return false;
		}
	};

	const handleDownloadAssets = async () => {
		const assets = Array.from($selectedAssets);
		let success = true;

		if (assets.length === 1) {
			const asset = assets[0];
			const imageName = asset.exifInfo?.imageName || asset.id;
			const imageExtension = asset.originalPath.split('.')[1];
			const imageFileName = imageName + '.' + imageExtension;

			success = await startDownload({
				getFilename: () => imageFileName,
				makeRequest: (_, config) =>
					api.assetApi.downloadFile(asset.deviceAssetId, asset.deviceId, false, false, config)
			});
		} else {
			const assetIds = assets.map((a) => a.id);
			success = await startDownload({
				getFilename: (count) => `archive${count === 1 ? '' : count}.zip`,
				makeRequest: (skip, config) =>
					api.assetApi.downloadFiles({ assetIds, skip: skip || undefined }, config)
			});
		}

		if (success) {
			assetInteractionStore.clearMultiselect();
		}
	};

	const handleDownloadLibrary = () => {
		startDownload({
			getFilename: (count) => `library${count === 1 ? '' : count}.zip`,
			makeRequest: (skip, config) => api.assetApi.downloadLibrary(skip || undefined, config)
		});
	};

	let contextMenuPosition = { x: 0, y: 0 };
	let isShowAddMenu = false;
	let isShowAlbumPicker = false;
	let addToSharedAlbum = false;

	const handleShowMenu = (event: CustomEvent) => {
		contextMenuPosition = {
			x: event.detail.mouseEvent.x,
			y: event.detail.mouseEvent.y
		};

		isShowAddMenu = !isShowAddMenu;
	};

	const handleShowAlbumPicker = (shared: boolean) => {
		isShowAddMenu = false;
		isShowAlbumPicker = true;
		addToSharedAlbum = shared;
	};

	const handleAddToNewAlbum = () => {
		isShowAlbumPicker = false;

		const assetIds = Array.from($selectedAssets).map((asset) => asset.id);
		api.albumApi.createAlbum({ albumName: 'Untitled', assetIds }).then((response) => {
			const { id, albumName } = response.data;

			notificationController.show({
				message: `Added ${assetIds.length} to ${albumName}`,
				type: NotificationType.Info
			});

			assetInteractionStore.clearMultiselect();

			goto('/albums/' + id);
		});
	};

	const handleAddToAlbum = async (event: CustomEvent<{ album: AlbumResponseDto }>) => {
		isShowAlbumPicker = false;
		const album = event.detail.album;

		const assetIds = Array.from($selectedAssets).map((asset) => asset.id);
		api.albumApi.addAssetsToAlbum(album.id, { assetIds }).then(({ data: dto }) => {
			notificationController.show({
				message: `Added ${dto.successfullyAdded} to ${dto.album?.albumName}`,
				type: NotificationType.Info
			});

			assetInteractionStore.clearMultiselect();
		});
	};
</script>

<svelte:head>
	<title>Photos - Immich</title>
</svelte:head>

<section>
	{#if $isMultiSelectStoreState}
		<ControlAppBar
			on:close-button-click={() => assetInteractionStore.clearMultiselect()}
			backIcon={Close}
			tailwindClasses={'bg-white shadow-md'}
		>
			<svelte:fragment slot="leading">
				<p class="font-medium text-immich-primary dark:text-immich-dark-primary">
					Selected {$selectedAssets.size}
				</p>
			</svelte:fragment>
			<svelte:fragment slot="trailing">
				<CircleIconButton title="Add" logo={Plus} on:click={handleShowMenu} />
				<CircleIconButton
					title="Download"
					logo={FolderDownloadOutline}
					on:click={handleDownloadAssets}
				/>
				<CircleIconButton
					title="Delete"
					logo={DeleteOutline}
					on:click={deleteSelectedAssetHandler}
				/>
			</svelte:fragment>
		</ControlAppBar>
	{:else}
		<NavigationBar
			user={data.user}
			on:uploadClicked={() => openFileUploadDialog(UploadType.GENERAL)}
			on:downloadClicked={handleDownloadLibrary}
		/>
	{/if}

	{#if isShowAddMenu}
		<ContextMenu {...contextMenuPosition} on:clickoutside={() => (isShowAddMenu = false)}>
			<div class="flex flex-col rounded-lg ">
				<MenuOption on:click={() => handleShowAlbumPicker(false)} text="Add to Album" />
				<MenuOption on:click={() => handleShowAlbumPicker(true)} text="Add to Shared Album" />
			</div>
		</ContextMenu>
	{/if}

	{#if isShowAlbumPicker}
		<AlbumSelectionModal
			shared={addToSharedAlbum}
			on:newAlbum={handleAddToNewAlbum}
			on:newSharedAlbum={handleAddToNewAlbum}
			on:album={handleAddToAlbum}
			on:close={() => (isShowAlbumPicker = false)}
		/>
	{/if}
</section>

<section
	class="grid grid-cols-[250px_auto] relative pt-[72px] h-screen bg-immich-bg dark:bg-immich-dark-bg"
>
	<SideBar />
	<AssetGrid />
</section>
