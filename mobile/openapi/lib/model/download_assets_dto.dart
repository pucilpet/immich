//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DownloadAssetsDto {
  /// Returns a new [DownloadAssetsDto] instance.
  DownloadAssetsDto({
    this.name = '',
    this.assetIds = const [],
    this.skip,
  });

  String name;

  List<String> assetIds;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? skip;

  @override
  bool operator ==(Object other) => identical(this, other) || other is DownloadAssetsDto &&
     other.name == name &&
     other.assetIds == assetIds &&
     other.skip == skip;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name.hashCode) +
    (assetIds.hashCode) +
    (skip == null ? 0 : skip!.hashCode);

  @override
  String toString() => 'DownloadAssetsDto[name=$name, assetIds=$assetIds, skip=$skip]';

  Map<String, dynamic> toJson() {
    final _json = <String, dynamic>{};
      _json[r'name'] = name;
      _json[r'assetIds'] = assetIds;
    if (skip != null) {
      _json[r'skip'] = skip;
    } else {
      _json[r'skip'] = null;
    }
    return _json;
  }

  /// Returns a new [DownloadAssetsDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DownloadAssetsDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "DownloadAssetsDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "DownloadAssetsDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DownloadAssetsDto(
        name: mapValueOfType<String>(json, r'name') ?? '',
        assetIds: json[r'assetIds'] is List
            ? (json[r'assetIds'] as List).cast<String>()
            : const [],
        skip: json[r'skip'] == null
            ? null
            : num.parse(json[r'skip'].toString()),
      );
    }
    return null;
  }

  static List<DownloadAssetsDto>? listFromJson(dynamic json, {bool growable = false,}) {
    final result = <DownloadAssetsDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DownloadAssetsDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DownloadAssetsDto> mapFromJson(dynamic json) {
    final map = <String, DownloadAssetsDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DownloadAssetsDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DownloadAssetsDto-objects as value to a dart map
  static Map<String, List<DownloadAssetsDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<DownloadAssetsDto>>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DownloadAssetsDto.listFromJson(entry.value, growable: growable,);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'assetIds',
  };
}

