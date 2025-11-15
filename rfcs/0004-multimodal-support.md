# RFC 0004: Multimodal Content Support

- **Status:** Implemented
- **Author(s):** AltairaLabs Team
- **Created:** 2025-11-06
- **Updated:** 2025-11-15
- **Implemented:** 2025-11-15
- **Related Issues:** None

## Summary

Add comprehensive multimodal content support to PromptPack, enabling prompts to work with images, audio, video, documents, and custom media types. This RFC defines schema extensions for media configuration, validation, and content parts with an extensible type system.

## Motivation

Modern LLMs support multimodal inputs (vision, audio, video), but PromptPack v1.0 only supported text-based prompts. This created gaps:

- **No image analysis** - Can't build vision AI applications
- **No audio processing** - Can't handle speech or audio data
- **No video understanding** - Can't process video content
- **Inconsistent implementations** - Each runtime implemented media differently
- **No validation** - No standard way to validate media inputs

### Goals

- Support image, audio, and video content in prompts
- Enable media validation (format, size, duration constraints)
- Support multiple media loading methods (file paths, URLs, base64)
- Maintain backward compatibility with text-only prompts
- Provide clear examples and documentation

### Non-Goals

- Define media processing algorithms or models
- Implement media conversion or transcoding
- Support real-time streaming media
- Handle DRM or encrypted media

## Detailed Design

### Schema Version

This RFC updates the schema from v1.0.0 to v1.1.0 (minor version bump for new features).

### New Schema Types

#### MediaConfig

Top-level multimodal configuration for a prompt:

```json
{
  "media": {
    "enabled": true,
    "supported_types": ["image", "audio", "video", "document"],
    "image": { ... },
    "audio": { ... },
    "video": { ... },
    "document": { ... },
    "examples": [ ... ]
  }
}
```

**Extensibility Note:** The `supported_types` array accepts any lowercase alphanumeric string (pattern: `^[a-z0-9_]+$`). Common types include `image`, `audio`, `video`, and `document`, but custom types like `model3d`, `archive`, etc. are allowed.

**Configuration Validation:** Each type listed in `supported_types` should have a corresponding configuration object:
- **Well-known types** (`image`, `audio`, `video`, `document`) use specific config schemas with type-appropriate properties
- **Custom types** use `GenericMediaTypeConfig` which provides common validation properties (`max_size_mb`, `allowed_formats`, `validation_params`)
- The schema uses `patternProperties` to validate that any field matching `^[a-z0-9_]+$` conforms to one of the config schemas

#### ImageConfig

Image-specific constraints:

```json
{
  "image": {
    "max_size_mb": 20,
    "allowed_formats": ["jpeg", "png", "webp"],
    "default_detail": "high",
    "require_caption": false,
    "max_images_per_msg": 5
  }
}
```

#### AudioConfig

Audio-specific constraints:

```json
{
  "audio": {
    "max_size_mb": 25,
    "allowed_formats": ["mp3", "wav", "opus"],
    "max_duration_sec": 300,
    "require_metadata": false
  }
}
```

#### VideoConfig

Video-specific constraints:

```json
{
  "video": {
    "max_size_mb": 100,
    "allowed_formats": ["mp4", "webm"],
    "max_duration_sec": 600,
    "require_metadata": false
  }
}
```

#### DocumentConfig

Document-specific constraints for PDFs, CAD files, spreadsheets, etc.:

```json
{
  "document": {
    "max_size_mb": 50,
    "allowed_formats": ["pdf", "docx", "step", "dwg"],
    "max_pages": 100,
    "require_metadata": false,
    "extraction_mode": "text"
  },
  "archive": {
    "max_size_mb": 200,
    "allowed_formats": ["zip", "tar", "gz", "7z"],
    "require_metadata": false,
    "validation_params": {
      "max_entries": 1000,
      "allow_nested": true,
      "max_depth": 5
    }
  }
}
```

**Supported Formats:** Any format can be specified. Common examples include:
- **Documents:** `pdf`, `docx`, `txt`, `md`
- **CAD Files:** `step`, `dwg`, `dxf`, `stl`
- **Spreadsheets:** `xlsx`, `csv`, `ods`
- **3D Models:** `obj`, `fbx`, `gltf`
- **Archives:** `zip`, `tar`, `gz`

**Extraction Modes:**
- `text` - Extract plain text content only
- `structured` - Preserve formatting and structure (tables, headings, etc.)
- `raw` - Keep original binary format for specialized processing

#### GenericMediaTypeConfig

Generic configuration for custom media types not covered by specific configs:

```json
{
  "model3d": {
    "max_size_mb": 100,
    "allowed_formats": ["obj", "fbx", "gltf", "stl"],
    "require_metadata": false,
    "validation_params": {
      "max_vertices": 100000,
      "require_textures": false,
      "allow_animations": true
    }
  }
}
```

**Common Properties:**
- `max_size_mb` - Maximum file size constraint
- `allowed_formats` - File format/extension whitelist
- `require_metadata` - Whether metadata is required
- `validation_params` - Custom validation parameters (structure depends on the type)

**Use Cases:**
- **3D Models:** `model3d` with vertex count, texture requirements
- **Archives:** `archive` with compression type, max entries
- **Point Clouds:** `pointcloud` with max points, coordinate system
- **Medical Imaging:** `medical_scan` with modality, resolution constraints

#### MultimodalExample

Example showing media usage:

```json
{
  "examples": [
    {
      "name": "image-analysis",
      "description": "Basic image analysis",
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "What's in this image?"
        },
        {
          "type": "image",
          "media": {
            "file_path": "examples/photo.jpg",
            "mime_type": "image/jpeg",
            "detail": "high",
            "caption": "Sample photo"
          }
        }
      ]
    }
  ]
}
```

#### ContentPart

Individual content part (text or media):

```json
{
  "type": "text",
  "text": "Describe this image"
}

{
  "type": "image",
  "media": {
    "file_path": "path/to/image.jpg",
    "mime_type": "image/jpeg"
  }
}
```

#### MediaReference

Reference to media file with three loading methods:

```json
{
  "file_path": "images/photo.jpg",
  "mime_type": "image/jpeg",
  "detail": "high",
  "caption": "Product photo"
}

{
  "url": "https://example.com/image.jpg",
  "mime_type": "image/jpeg"
}

{
  "base64": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  "mime_type": "image/png"
}
```

### Key Design Decisions

#### Optional Media Support

Media configuration is optional at the prompt level:

```json
{
  "prompts": {
    "text-only": {
      "system_template": "Text-only prompt",
      // No media field
    },
    "vision": {
      "system_template": "Vision prompt",
      "media": {
        "enabled": true,
        "supported_types": ["image"]
      }
    }
  }
}
```

**Rationale**: Maintains backward compatibility and doesn't force media support on all prompts.

#### Three Loading Methods

Support file paths, URLs, and base64:

**Rationale**:
- **File paths** - Best for development and local testing
- **URLs** - Best for production and CDN-hosted media
- **Base64** - Best for small media or embedding

#### Parts-Based Message Format

Messages consist of ordered content parts:

```json
{
  "parts": [
    {"type": "text", "text": "Analyze these images:"},
    {"type": "image", "media": {...}},
    {"type": "image", "media": {...}},
    {"type": "text", "text": "Provide detailed analysis."}
  ]
}
```

**Rationale**: Flexible ordering and mixing of text and media.

#### Extensible Media Types

The `supported_types` array and content part `type` field accept any lowercase alphanumeric string matching pattern `^[a-z0-9_]+$`:

```json
{
  "media": {
    "enabled": true,
    "supported_types": ["image", "document", "model3d", "custom_type"]
  }
}
```

**Rationale**:

- **Future-proof** - New media types (3D models, point clouds, holograms) can be added without schema updates
- **Domain-specific** - Organizations can define custom types for their use cases (e.g., `medical_scan`, `satellite_image`)
- **No artificial limits** - Schema doesn't constrain innovation in multimodal AI
- **Standard patterns** - Common types (`image`, `audio`, `video`, `document`) establish conventions while allowing extension

**Validation Approach**:

The schema uses `patternProperties` on `MediaConfig` to validate configuration objects:

```json
{
  "patternProperties": {
    "^[a-z0-9_]+$": {
      "oneOf": [
        {"$ref": "#/$defs/ImageConfig"},
        {"$ref": "#/$defs/AudioConfig"},
        {"$ref": "#/$defs/VideoConfig"},
        {"$ref": "#/$defs/DocumentConfig"},
        {"$ref": "#/$defs/GenericMediaTypeConfig"}
      ]
    }
  }
}
```

This means:
1. **Well-known types** (`image`, `audio`, `video`, `document`) use specific config schemas with type-appropriate properties
2. **Custom types** (e.g., `model3d`, `archive`, `pointcloud`) use `GenericMediaTypeConfig` for common validation
3. **All config objects are validated** - you can't add arbitrary unstructured data
4. **Runtimes choose support** - Each runtime documents which types it implements

#### Compile-Time Validation

PackC compiler validates media references at compile time:

- Check file paths exist
- Validate formats match allowed_formats
- Verify file sizes within limits
- Ensure MIME types are correct

**Rationale**: Catch errors early, before runtime.

## Examples

### Simple Image Analysis

```json
{
  "id": "image-analyzer",
  "name": "Image Analyzer",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "analyze": {
      "id": "analyze",
      "name": "Image Analyzer",
      "version": "1.0.0",
      "system_template": "You are an expert image analyst.",
      "media": {
        "enabled": true,
        "supported_types": ["image"],
        "image": {
          "max_size_mb": 10,
          "allowed_formats": ["jpeg", "png", "webp"],
          "default_detail": "high"
        }
      }
    }
  }
}
```

### Multi-Modal Assistant

```json
{
  "prompts": {
    "assistant": {
      "system_template": "You are a multimodal assistant.",
      "media": {
        "enabled": true,
        "supported_types": ["image", "audio", "video"],
        "image": {
          "max_size_mb": 20,
          "allowed_formats": ["jpeg", "png", "webp", "gif"]
        },
        "audio": {
          "max_size_mb": 25,
          "allowed_formats": ["mp3", "wav", "opus"],
          "max_duration_sec": 300
        },
        "video": {
          "max_size_mb": 100,
          "allowed_formats": ["mp4", "webm"],
          "max_duration_sec": 600
        }
      }
    }
  }
}
```

### Document Analysis (PDF, CAD)

```json
{
  "prompts": {
    "doc-analyzer": {
      "system_template": "You are a document analysis assistant that can process PDFs, CAD files, and technical documents.",
      "media": {
        "enabled": true,
        "supported_types": ["document", "image"],
        "document": {
          "max_size_mb": 50,
          "allowed_formats": ["pdf", "step", "dwg", "dxf"],
          "max_pages": 100,
          "extraction_mode": "structured"
        },
        "image": {
          "max_size_mb": 10,
          "allowed_formats": ["jpeg", "png"]
        },
        "examples": [
          {
            "name": "cad-analysis",
            "description": "Analyze a CAD file",
            "role": "user",
            "parts": [
              {
                "type": "text",
                "text": "Analyze this mechanical part design and identify potential manufacturing issues."
              },
              {
                "type": "document",
                "media": {
                  "file_path": "examples/part.step",
                  "mime_type": "application/step",
                  "caption": "Mechanical part CAD model"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Example Usage in YAML

```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: PromptConfig
metadata:
  name: vision-assistant
  version: 1.0.0

spec:
  system_template: "You are an expert image analyst."
  
  media:
    enabled: true
    supported_types:
      - image
    image:
      max_size_mb: 10
      allowed_formats:
        - jpeg
        - png
        - webp
      default_detail: high
    
    examples:
      - name: simple-analysis
        role: user
        parts:
          - type: text
            text: "What's in this image?"
          - type: image
            media:
              file_path: examples/photo.jpg
              mime_type: image/jpeg
              detail: high
```

### Custom Media Type (3D Models)

```json
{
  "prompts": {
    "3d-analyzer": {
      "system_template": "You are a 3D model analysis assistant.",
      "media": {
        "enabled": true,
        "supported_types": ["model3d", "image"],
        "model3d": {
          "max_size_mb": 100,
          "allowed_formats": ["obj", "fbx", "gltf", "stl"],
          "validation_params": {
            "max_vertices": 500000,
            "require_textures": false,
            "allow_animations": true
          }
        },
        "image": {
          "max_size_mb": 10,
          "allowed_formats": ["jpeg", "png"]
        },
        "examples": [
          {
            "name": "model-analysis",
            "description": "Analyze a 3D model",
            "role": "user",
            "parts": [
              {
                "type": "text",
                "text": "Analyze this 3D model for structural integrity."
              },
              {
                "type": "model3d",
                "media": {
                  "file_path": "examples/part.obj",
                  "mime_type": "model/obj",
                  "caption": "Mechanical component"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

## Drawbacks

- **Increased complexity** - More schema types and validation rules
- **Storage implications** - Media files can be large
- **Network overhead** - Downloading remote media takes time
- **Runtime dependencies** - Runtimes must support media processing
- **Open-ended extensibility** - Pattern-based validation allows arbitrary types, requiring runtime-specific handling

## Alternatives

### Alternative 1: Text-Only with External Media Handling

Keep PromptPack text-only, handle media externally.

**Rejected**: Loses portability and standard validation.

### Alternative 2: Fixed Enum of Media Types

Use strict enum: `["image", "audio", "video", "document"]`.

**Rejected**: Would require schema updates for every new media type (3D models, point clouds, holograms, etc.). Pattern-based validation (`^[a-z0-9_]+$`) provides extensibility while maintaining structure.

### Alternative 3: MIME Type Based Classification

Use MIME types instead of custom type strings.

**Considered but not chosen**: MIME types are too granular (`image/jpeg` vs `image/png`). Our approach uses semantic categories (`image`, `document`) with format-specific constraints in the config objects.

### Alternative 4: Inline Base64 Only

Only support base64-encoded media.

**Rejected**: Impractical for large files, poor for version control.

## Adoption Strategy

### Backward Compatibility

✅ Fully backward compatible:

- Media field is optional
- Existing packs without media continue to work
- No breaking changes to v1.0 schema

### Migration Path

Existing text-only packs can add media support:

```json
{
  "prompts": {
    "existing-prompt": {
      "system_template": "...",
      // Add media configuration
      "media": {
        "enabled": true,
        "supported_types": ["image"]
      }
    }
  }
}
```

## Implementation Plan

1. **Phase 1:** Update JSON schema to v1.1.0 ✅
2. **Phase 2:** Implement media validation in PackC ✅
3. **Phase 3:** Update documentation ⏳
4. **Phase 4:** Add example packs with media ⏳
5. **Phase 5:** Runtime implementation (PromptKit) ✅

## Testing Strategy

- Schema validation for all media types
- Compile-time media reference validation
- Example packs for each media type
- Integration tests with actual media files
- Performance testing with large media files

## Documentation Impact

- [x] Update schema reference with media types
- [ ] Add multimodal section to structure docs
- [ ] Add multimodal examples
- [ ] Document media loading strategies
- [ ] Add migration guide

See: `local-backlog/multimodal-spec-gaps-analysis.md` for complete documentation plan.

## Unresolved Questions

### How should runtimes handle unknown media types?

When a runtime encounters a media type it doesn't support (e.g., `model3d`), it should:

1. **Fail gracefully** - Return clear error message indicating unsupported type
2. **Document supported types** - Each runtime should clearly document which types it supports
3. **Provide extension points** - Allow plugins/extensions to add support for custom types

**Recommendation**: Establish runtime capability negotiation in future RFC.

### Should there be a registry of standard media types?

Possible options:

- **Option A:** Maintain official registry in spec repo (e.g., `media-types.md`)
- **Option B:** Community-driven convention without formal registry
- **Option C:** Allow complete freedom, document common patterns in examples

**Current decision**: Start with Option B, revisit if fragmentation becomes problematic.

### Should GenericMediaTypeConfig support type-specific validation?

Currently, `validation_params` is a freeform object. Should we:

- **Option A:** Keep it flexible (current approach) - allows any structure
- **Option B:** Define common validation patterns (e.g., dimensional constraints, coordinate systems)
- **Option C:** Create type-specific extensions of GenericMediaTypeConfig

**Current decision**: Option A provides maximum flexibility. If common patterns emerge, we can add them in v1.2+ without breaking changes.

---

## Revision History

- **2024-11-06:** Initial implementation in PromptKit
- **2024-11-13:** Added PromptArena multimodal support
- **2025-11-15:** Formalized as RFC and updated schema to v1.1.0

## References

- [PromptKit Multimodal Implementation](https://github.com/AltairaLabs/PromptKit)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Anthropic Claude Vision](https://docs.anthropic.com/claude/docs/vision)
- [RFC-0001: Core PromptPack Schema](0001-core-schema.md)
