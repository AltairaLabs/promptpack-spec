# PromptPack Specification

- [1. Property `PromptPack Specification > $schema`](#schema)
- [2. Property `PromptPack Specification > id`](#id)
- [3. Property `PromptPack Specification > name`](#name)
- [4. Property `PromptPack Specification > version`](#version)
- [5. Property `PromptPack Specification > description`](#description)
- [6. Property `PromptPack Specification > template_engine`](#template_engine)
  - [6.1. Property `PromptPack Specification > template_engine > version`](#template_engine_version)
  - [6.2. Property `PromptPack Specification > template_engine > syntax`](#template_engine_syntax)
  - [6.3. Property `PromptPack Specification > template_engine > features`](#template_engine_features)
    - [6.3.1. PromptPack Specification > template_engine > features > features items](#template_engine_features_items)
- [7. Property `PromptPack Specification > prompts`](#prompts)
  - [7.1. Property `PromptPack Specification > prompts > Prompt`](#prompts_additionalProperties)
    - [7.1.1. Property `PromptPack Specification > prompts > additionalProperties > id`](#prompts_additionalProperties_id)
    - [7.1.2. Property `PromptPack Specification > prompts > additionalProperties > name`](#prompts_additionalProperties_name)
    - [7.1.3. Property `PromptPack Specification > prompts > additionalProperties > description`](#prompts_additionalProperties_description)
    - [7.1.4. Property `PromptPack Specification > prompts > additionalProperties > version`](#prompts_additionalProperties_version)
    - [7.1.5. Property `PromptPack Specification > prompts > additionalProperties > system_template`](#prompts_additionalProperties_system_template)
    - [7.1.6. Property `PromptPack Specification > prompts > additionalProperties > variables`](#prompts_additionalProperties_variables)
      - [7.1.6.1. PromptPack Specification > prompts > additionalProperties > variables > Variable](#prompts_additionalProperties_variables_items)
        - [7.1.6.1.1. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > name`](#prompts_additionalProperties_variables_items_name)
        - [7.1.6.1.2. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > type`](#prompts_additionalProperties_variables_items_type)
        - [7.1.6.1.3. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > required`](#prompts_additionalProperties_variables_items_required)
        - [7.1.6.1.4. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > default`](#prompts_additionalProperties_variables_items_default)
        - [7.1.6.1.5. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > description`](#prompts_additionalProperties_variables_items_description)
        - [7.1.6.1.6. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > example`](#prompts_additionalProperties_variables_items_example)
        - [7.1.6.1.7. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation`](#prompts_additionalProperties_variables_items_validation)
          - [7.1.6.1.7.1. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > pattern`](#prompts_additionalProperties_variables_items_validation_pattern)
          - [7.1.6.1.7.2. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > min_length`](#prompts_additionalProperties_variables_items_validation_min_length)
          - [7.1.6.1.7.3. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > max_length`](#prompts_additionalProperties_variables_items_validation_max_length)
          - [7.1.6.1.7.4. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > minimum`](#prompts_additionalProperties_variables_items_validation_minimum)
          - [7.1.6.1.7.5. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > maximum`](#prompts_additionalProperties_variables_items_validation_maximum)
          - [7.1.6.1.7.6. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > enum`](#prompts_additionalProperties_variables_items_validation_enum)
            - [7.1.6.1.7.6.1. PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > enum > enum items](#prompts_additionalProperties_variables_items_validation_enum_items)
    - [7.1.7. Property `PromptPack Specification > prompts > additionalProperties > tools`](#prompts_additionalProperties_tools)
      - [7.1.7.1. PromptPack Specification > prompts > additionalProperties > tools > tools items](#prompts_additionalProperties_tools_items)
    - [7.1.8. Property `PromptPack Specification > prompts > additionalProperties > tool_policy`](#prompts_additionalProperties_tool_policy)
      - [7.1.8.1. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > tool_choice`](#prompts_additionalProperties_tool_policy_tool_choice)
      - [7.1.8.2. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > max_rounds`](#prompts_additionalProperties_tool_policy_max_rounds)
      - [7.1.8.3. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > max_tool_calls_per_turn`](#prompts_additionalProperties_tool_policy_max_tool_calls_per_turn)
      - [7.1.8.4. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > blocklist`](#prompts_additionalProperties_tool_policy_blocklist)
        - [7.1.8.4.1. PromptPack Specification > prompts > additionalProperties > tool_policy > blocklist > blocklist items](#prompts_additionalProperties_tool_policy_blocklist_items)
    - [7.1.9. Property `PromptPack Specification > prompts > additionalProperties > pipeline`](#prompts_additionalProperties_pipeline)
      - [7.1.9.1. Property `PromptPack Specification > prompts > additionalProperties > pipeline > stages`](#prompts_additionalProperties_pipeline_stages)
        - [7.1.9.1.1. PromptPack Specification > prompts > additionalProperties > pipeline > stages > stages items](#prompts_additionalProperties_pipeline_stages_items)
      - [7.1.9.2. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware`](#prompts_additionalProperties_pipeline_middleware)
        - [7.1.9.2.1. PromptPack Specification > prompts > additionalProperties > pipeline > middleware > MiddlewareConfig](#prompts_additionalProperties_pipeline_middleware_items)
          - [7.1.9.2.1.1. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware > middleware items > type`](#prompts_additionalProperties_pipeline_middleware_items_type)
          - [7.1.9.2.1.2. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware > middleware items > config`](#prompts_additionalProperties_pipeline_middleware_items_config)
    - [7.1.10. Property `PromptPack Specification > prompts > additionalProperties > parameters`](#prompts_additionalProperties_parameters)
      - [7.1.10.1. Property `PromptPack Specification > prompts > additionalProperties > parameters > temperature`](#prompts_additionalProperties_parameters_temperature)
      - [7.1.10.2. Property `PromptPack Specification > prompts > additionalProperties > parameters > max_tokens`](#prompts_additionalProperties_parameters_max_tokens)
      - [7.1.10.3. Property `PromptPack Specification > prompts > additionalProperties > parameters > top_p`](#prompts_additionalProperties_parameters_top_p)
      - [7.1.10.4. Property `PromptPack Specification > prompts > additionalProperties > parameters > top_k`](#prompts_additionalProperties_parameters_top_k)
      - [7.1.10.5. Property `PromptPack Specification > prompts > additionalProperties > parameters > frequency_penalty`](#prompts_additionalProperties_parameters_frequency_penalty)
      - [7.1.10.6. Property `PromptPack Specification > prompts > additionalProperties > parameters > presence_penalty`](#prompts_additionalProperties_parameters_presence_penalty)
    - [7.1.11. Property `PromptPack Specification > prompts > additionalProperties > validators`](#prompts_additionalProperties_validators)
      - [7.1.11.1. PromptPack Specification > prompts > additionalProperties > validators > Validator](#prompts_additionalProperties_validators_items)
        - [7.1.11.1.1. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > type`](#prompts_additionalProperties_validators_items_type)
        - [7.1.11.1.2. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > enabled`](#prompts_additionalProperties_validators_items_enabled)
        - [7.1.11.1.3. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > fail_on_violation`](#prompts_additionalProperties_validators_items_fail_on_violation)
        - [7.1.11.1.4. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > params`](#prompts_additionalProperties_validators_items_params)
    - [7.1.12. Property `PromptPack Specification > prompts > additionalProperties > evals`](#prompts_additionalProperties_evals)
      - [7.1.12.1. PromptPack Specification > prompts > additionalProperties > evals > Eval](#prompts_additionalProperties_evals_items)
        - [7.1.12.1.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > id`](#prompts_additionalProperties_evals_items_id)
        - [7.1.12.1.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > description`](#prompts_additionalProperties_evals_items_description)
        - [7.1.12.1.3. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > type`](#prompts_additionalProperties_evals_items_type)
        - [7.1.12.1.4. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > trigger`](#prompts_additionalProperties_evals_items_trigger)
        - [7.1.12.1.5. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > sample_percentage`](#prompts_additionalProperties_evals_items_sample_percentage)
        - [7.1.12.1.6. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > enabled`](#prompts_additionalProperties_evals_items_enabled)
        - [7.1.12.1.7. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > params`](#prompts_additionalProperties_evals_items_params)
        - [7.1.12.1.8. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric`](#prompts_additionalProperties_evals_items_metric)
          - [7.1.12.1.8.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > name`](#prompts_additionalProperties_evals_items_metric_name)
          - [7.1.12.1.8.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > type`](#prompts_additionalProperties_evals_items_metric_type)
          - [7.1.12.1.8.3. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range`](#prompts_additionalProperties_evals_items_metric_range)
            - [7.1.12.1.8.3.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range > min`](#prompts_additionalProperties_evals_items_metric_range_min)
            - [7.1.12.1.8.3.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range > max`](#prompts_additionalProperties_evals_items_metric_range_max)
    - [7.1.13. Property `PromptPack Specification > prompts > additionalProperties > tested_models`](#prompts_additionalProperties_tested_models)
      - [7.1.13.1. PromptPack Specification > prompts > additionalProperties > tested_models > TestedModel](#prompts_additionalProperties_tested_models_items)
        - [7.1.13.1.1. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > provider`](#prompts_additionalProperties_tested_models_items_provider)
        - [7.1.13.1.2. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > model`](#prompts_additionalProperties_tested_models_items_model)
        - [7.1.13.1.3. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > date`](#prompts_additionalProperties_tested_models_items_date)
        - [7.1.13.1.4. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > success_rate`](#prompts_additionalProperties_tested_models_items_success_rate)
        - [7.1.13.1.5. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_tokens`](#prompts_additionalProperties_tested_models_items_avg_tokens)
        - [7.1.13.1.6. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_cost`](#prompts_additionalProperties_tested_models_items_avg_cost)
        - [7.1.13.1.7. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_latency_ms`](#prompts_additionalProperties_tested_models_items_avg_latency_ms)
        - [7.1.13.1.8. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > notes`](#prompts_additionalProperties_tested_models_items_notes)
    - [7.1.14. Property `PromptPack Specification > prompts > additionalProperties > model_overrides`](#prompts_additionalProperties_model_overrides)
      - [7.1.14.1. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > ModelOverride`](#prompts_additionalProperties_model_overrides_additionalProperties)
        - [7.1.14.1.1. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template_prefix`](#prompts_additionalProperties_model_overrides_additionalProperties_system_template_prefix)
        - [7.1.14.1.2. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template_suffix`](#prompts_additionalProperties_model_overrides_additionalProperties_system_template_suffix)
        - [7.1.14.1.3. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template`](#prompts_additionalProperties_model_overrides_additionalProperties_system_template)
        - [7.1.14.1.4. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > parameters`](#prompts_additionalProperties_model_overrides_additionalProperties_parameters)
    - [7.1.15. Property `PromptPack Specification > prompts > additionalProperties > media`](#prompts_additionalProperties_media)
      - [7.1.15.1. Property `PromptPack Specification > prompts > additionalProperties > media > enabled`](#prompts_additionalProperties_media_enabled)
      - [7.1.15.2. Property `PromptPack Specification > prompts > additionalProperties > media > supported_types`](#prompts_additionalProperties_media_supported_types)
        - [7.1.15.2.1. PromptPack Specification > prompts > additionalProperties > media > supported_types > supported_types items](#prompts_additionalProperties_media_supported_types_items)
      - [7.1.15.3. Property `PromptPack Specification > prompts > additionalProperties > media > image`](#prompts_additionalProperties_media_image)
        - [7.1.15.3.1. Property `PromptPack Specification > prompts > additionalProperties > media > image > max_size_mb`](#prompts_additionalProperties_media_image_max_size_mb)
        - [7.1.15.3.2. Property `PromptPack Specification > prompts > additionalProperties > media > image > allowed_formats`](#prompts_additionalProperties_media_image_allowed_formats)
          - [7.1.15.3.2.1. PromptPack Specification > prompts > additionalProperties > media > image > allowed_formats > allowed_formats items](#prompts_additionalProperties_media_image_allowed_formats_items)
        - [7.1.15.3.3. Property `PromptPack Specification > prompts > additionalProperties > media > image > default_detail`](#prompts_additionalProperties_media_image_default_detail)
        - [7.1.15.3.4. Property `PromptPack Specification > prompts > additionalProperties > media > image > require_caption`](#prompts_additionalProperties_media_image_require_caption)
        - [7.1.15.3.5. Property `PromptPack Specification > prompts > additionalProperties > media > image > max_images_per_msg`](#prompts_additionalProperties_media_image_max_images_per_msg)
      - [7.1.15.4. Property `PromptPack Specification > prompts > additionalProperties > media > audio`](#prompts_additionalProperties_media_audio)
        - [7.1.15.4.1. Property `PromptPack Specification > prompts > additionalProperties > media > audio > max_size_mb`](#prompts_additionalProperties_media_audio_max_size_mb)
        - [7.1.15.4.2. Property `PromptPack Specification > prompts > additionalProperties > media > audio > allowed_formats`](#prompts_additionalProperties_media_audio_allowed_formats)
          - [7.1.15.4.2.1. PromptPack Specification > prompts > additionalProperties > media > audio > allowed_formats > allowed_formats items](#prompts_additionalProperties_media_audio_allowed_formats_items)
        - [7.1.15.4.3. Property `PromptPack Specification > prompts > additionalProperties > media > audio > max_duration_sec`](#prompts_additionalProperties_media_audio_max_duration_sec)
        - [7.1.15.4.4. Property `PromptPack Specification > prompts > additionalProperties > media > audio > require_metadata`](#prompts_additionalProperties_media_audio_require_metadata)
      - [7.1.15.5. Property `PromptPack Specification > prompts > additionalProperties > media > video`](#prompts_additionalProperties_media_video)
        - [7.1.15.5.1. Property `PromptPack Specification > prompts > additionalProperties > media > video > max_size_mb`](#prompts_additionalProperties_media_video_max_size_mb)
        - [7.1.15.5.2. Property `PromptPack Specification > prompts > additionalProperties > media > video > allowed_formats`](#prompts_additionalProperties_media_video_allowed_formats)
          - [7.1.15.5.2.1. PromptPack Specification > prompts > additionalProperties > media > video > allowed_formats > allowed_formats items](#prompts_additionalProperties_media_video_allowed_formats_items)
        - [7.1.15.5.3. Property `PromptPack Specification > prompts > additionalProperties > media > video > max_duration_sec`](#prompts_additionalProperties_media_video_max_duration_sec)
        - [7.1.15.5.4. Property `PromptPack Specification > prompts > additionalProperties > media > video > require_metadata`](#prompts_additionalProperties_media_video_require_metadata)
      - [7.1.15.6. Property `PromptPack Specification > prompts > additionalProperties > media > document`](#prompts_additionalProperties_media_document)
        - [7.1.15.6.1. Property `PromptPack Specification > prompts > additionalProperties > media > document > max_size_mb`](#prompts_additionalProperties_media_document_max_size_mb)
        - [7.1.15.6.2. Property `PromptPack Specification > prompts > additionalProperties > media > document > allowed_formats`](#prompts_additionalProperties_media_document_allowed_formats)
          - [7.1.15.6.2.1. PromptPack Specification > prompts > additionalProperties > media > document > allowed_formats > allowed_formats items](#prompts_additionalProperties_media_document_allowed_formats_items)
        - [7.1.15.6.3. Property `PromptPack Specification > prompts > additionalProperties > media > document > max_pages`](#prompts_additionalProperties_media_document_max_pages)
        - [7.1.15.6.4. Property `PromptPack Specification > prompts > additionalProperties > media > document > require_metadata`](#prompts_additionalProperties_media_document_require_metadata)
        - [7.1.15.6.5. Property `PromptPack Specification > prompts > additionalProperties > media > document > extraction_mode`](#prompts_additionalProperties_media_document_extraction_mode)
      - [7.1.15.7. Property `PromptPack Specification > prompts > additionalProperties > media > examples`](#prompts_additionalProperties_media_examples)
        - [7.1.15.7.1. PromptPack Specification > prompts > additionalProperties > media > examples > MultimodalExample](#prompts_additionalProperties_media_examples_items)
          - [7.1.15.7.1.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > name`](#prompts_additionalProperties_media_examples_items_name)
          - [7.1.15.7.1.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > description`](#prompts_additionalProperties_media_examples_items_description)
          - [7.1.15.7.1.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > role`](#prompts_additionalProperties_media_examples_items_role)
          - [7.1.15.7.1.4. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts`](#prompts_additionalProperties_media_examples_items_parts)
            - [7.1.15.7.1.4.1. PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > ContentPart](#prompts_additionalProperties_media_examples_items_parts_items)
              - [7.1.15.7.1.4.1.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > type`](#prompts_additionalProperties_media_examples_items_parts_items_type)
              - [7.1.15.7.1.4.1.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > text`](#prompts_additionalProperties_media_examples_items_parts_items_text)
              - [7.1.15.7.1.4.1.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media`](#prompts_additionalProperties_media_examples_items_parts_items_media)
                - [7.1.15.7.1.4.1.3.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > file_path`](#prompts_additionalProperties_media_examples_items_parts_items_media_file_path)
                - [7.1.15.7.1.4.1.3.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > url`](#prompts_additionalProperties_media_examples_items_parts_items_media_url)
                - [7.1.15.7.1.4.1.3.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > base64`](#prompts_additionalProperties_media_examples_items_parts_items_media_base64)
                - [7.1.15.7.1.4.1.3.4. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > mime_type`](#prompts_additionalProperties_media_examples_items_parts_items_media_mime_type)
                - [7.1.15.7.1.4.1.3.5. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > detail`](#prompts_additionalProperties_media_examples_items_parts_items_media_detail)
                - [7.1.15.7.1.4.1.3.6. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > caption`](#prompts_additionalProperties_media_examples_items_parts_items_media_caption)
      - [7.1.15.8. Pattern Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$`](#prompts_additionalProperties_media_pattern1)
        - [7.1.15.8.1. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > ImageConfig`](#prompts_additionalProperties_media_pattern1_pattern1_i0)
        - [7.1.15.8.2. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > AudioConfig`](#prompts_additionalProperties_media_pattern1_pattern1_i1)
        - [7.1.15.8.3. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > VideoConfig`](#prompts_additionalProperties_media_pattern1_pattern1_i2)
        - [7.1.15.8.4. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > DocumentConfig`](#prompts_additionalProperties_media_pattern1_pattern1_i3)
        - [7.1.15.8.5. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > GenericMediaTypeConfig`](#prompts_additionalProperties_media_pattern1_pattern1_i4)
          - [7.1.15.8.5.1. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > max_size_mb`](#prompts_additionalProperties_media_pattern1_pattern1_i4_max_size_mb)
          - [7.1.15.8.5.2. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > allowed_formats`](#prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats)
            - [7.1.15.8.5.2.1. PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > allowed_formats > allowed_formats items](#prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats_items)
          - [7.1.15.8.5.3. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > require_metadata`](#prompts_additionalProperties_media_pattern1_pattern1_i4_require_metadata)
          - [7.1.15.8.5.4. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > validation_params`](#prompts_additionalProperties_media_pattern1_pattern1_i4_validation_params)
- [8. Property `PromptPack Specification > fragments`](#fragments)
  - [8.1. Property `PromptPack Specification > fragments > additionalProperties`](#fragments_additionalProperties)
- [9. Property `PromptPack Specification > tools`](#tools)
  - [9.1. Property `PromptPack Specification > tools > Tool`](#tools_additionalProperties)
    - [9.1.1. Property `PromptPack Specification > tools > additionalProperties > name`](#tools_additionalProperties_name)
    - [9.1.2. Property `PromptPack Specification > tools > additionalProperties > description`](#tools_additionalProperties_description)
    - [9.1.3. Property `PromptPack Specification > tools > additionalProperties > parameters`](#tools_additionalProperties_parameters)
      - [9.1.3.1. Property `PromptPack Specification > tools > additionalProperties > parameters > type`](#tools_additionalProperties_parameters_type)
      - [9.1.3.2. Property `PromptPack Specification > tools > additionalProperties > parameters > properties`](#tools_additionalProperties_parameters_properties)
        - [9.1.3.2.1. Property `PromptPack Specification > tools > additionalProperties > parameters > properties > additionalProperties`](#tools_additionalProperties_parameters_properties_additionalProperties)
      - [9.1.3.3. Property `PromptPack Specification > tools > additionalProperties > parameters > required`](#tools_additionalProperties_parameters_required)
        - [9.1.3.3.1. PromptPack Specification > tools > additionalProperties > parameters > required > required items](#tools_additionalProperties_parameters_required_items)
- [10. Property `PromptPack Specification > metadata`](#metadata)
  - [10.1. Property `PromptPack Specification > metadata > domain`](#metadata_domain)
  - [10.2. Property `PromptPack Specification > metadata > language`](#metadata_language)
  - [10.3. Property `PromptPack Specification > metadata > tags`](#metadata_tags)
    - [10.3.1. PromptPack Specification > metadata > tags > tags items](#metadata_tags_items)
  - [10.4. Property `PromptPack Specification > metadata > cost_estimate`](#metadata_cost_estimate)
    - [10.4.1. Property `PromptPack Specification > metadata > cost_estimate > min_cost_usd`](#metadata_cost_estimate_min_cost_usd)
    - [10.4.2. Property `PromptPack Specification > metadata > cost_estimate > max_cost_usd`](#metadata_cost_estimate_max_cost_usd)
    - [10.4.3. Property `PromptPack Specification > metadata > cost_estimate > avg_cost_usd`](#metadata_cost_estimate_avg_cost_usd)
- [11. Property `PromptPack Specification > compilation`](#compilation)
  - [11.1. Property `PromptPack Specification > compilation > compiled_with`](#compilation_compiled_with)
  - [11.2. Property `PromptPack Specification > compilation > created_at`](#compilation_created_at)
  - [11.3. Property `PromptPack Specification > compilation > schema`](#compilation_schema)
  - [11.4. Property `PromptPack Specification > compilation > source`](#compilation_source)
- [12. Property `PromptPack Specification > evals`](#evals)
  - [12.1. PromptPack Specification > evals > Eval](#evals_items)
- [13. Property `PromptPack Specification > workflow`](#workflow)
  - [13.1. Property `PromptPack Specification > workflow > version`](#workflow_version)
  - [13.2. Property `PromptPack Specification > workflow > entry`](#workflow_entry)
  - [13.3. Property `PromptPack Specification > workflow > states`](#workflow_states)
    - [13.3.1. Property `PromptPack Specification > workflow > states > WorkflowState`](#workflow_states_additionalProperties)
      - [13.3.1.1. Property `PromptPack Specification > workflow > states > additionalProperties > prompt_task`](#workflow_states_additionalProperties_prompt_task)
      - [13.3.1.2. Property `PromptPack Specification > workflow > states > additionalProperties > description`](#workflow_states_additionalProperties_description)
      - [13.3.1.3. Property `PromptPack Specification > workflow > states > additionalProperties > on_event`](#workflow_states_additionalProperties_on_event)
        - [13.3.1.3.1. Property `PromptPack Specification > workflow > states > additionalProperties > on_event > additionalProperties`](#workflow_states_additionalProperties_on_event_additionalProperties)
      - [13.3.1.4. Property `PromptPack Specification > workflow > states > additionalProperties > persistence`](#workflow_states_additionalProperties_persistence)
      - [13.3.1.5. Property `PromptPack Specification > workflow > states > additionalProperties > orchestration`](#workflow_states_additionalProperties_orchestration)
      - [13.3.1.6. Property `PromptPack Specification > workflow > states > additionalProperties > skills`](#workflow_states_additionalProperties_skills)
  - [13.4. Property `PromptPack Specification > workflow > engine`](#workflow_engine)
- [14. Property `PromptPack Specification > agents`](#agents)
  - [14.1. Property `PromptPack Specification > agents > entry`](#agents_entry)
  - [14.2. Property `PromptPack Specification > agents > members`](#agents_members)
    - [14.2.1. Property `PromptPack Specification > agents > members > AgentDef`](#agents_members_additionalProperties)
      - [14.2.1.1. Property `PromptPack Specification > agents > members > additionalProperties > description`](#agents_members_additionalProperties_description)
      - [14.2.1.2. Property `PromptPack Specification > agents > members > additionalProperties > tags`](#agents_members_additionalProperties_tags)
        - [14.2.1.2.1. PromptPack Specification > agents > members > additionalProperties > tags > tags items](#agents_members_additionalProperties_tags_items)
      - [14.2.1.3. Property `PromptPack Specification > agents > members > additionalProperties > input_modes`](#agents_members_additionalProperties_input_modes)
        - [14.2.1.3.1. PromptPack Specification > agents > members > additionalProperties > input_modes > input_modes items](#agents_members_additionalProperties_input_modes_items)
      - [14.2.1.4. Property `PromptPack Specification > agents > members > additionalProperties > output_modes`](#agents_members_additionalProperties_output_modes)
        - [14.2.1.4.1. PromptPack Specification > agents > members > additionalProperties > output_modes > output_modes items](#agents_members_additionalProperties_output_modes_items)
- [15. Property `PromptPack Specification > skills`](#skills)
  - [15.1. PromptPack Specification > skills > SkillSource](#skills_items)
    - [15.1.1. Property `PromptPack Specification > skills > skills items > oneOf > item 0`](#skills_items_oneOf_i0)
    - [15.1.2. Property `PromptPack Specification > skills > skills items > oneOf > SkillPathSource`](#skills_items_oneOf_i1)
      - [15.1.2.1. Property `PromptPack Specification > skills > skills items > oneOf > item 1 > path`](#skills_items_oneOf_i1_path)
      - [15.1.2.2. Property `PromptPack Specification > skills > skills items > oneOf > item 1 > preload`](#skills_items_oneOf_i1_preload)
    - [15.1.3. Property `PromptPack Specification > skills > skills items > oneOf > InlineSkill`](#skills_items_oneOf_i2)
      - [15.1.3.1. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > name`](#skills_items_oneOf_i2_name)
      - [15.1.3.2. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > description`](#skills_items_oneOf_i2_description)
      - [15.1.3.3. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > instructions`](#skills_items_oneOf_i2_instructions)

**Title:** PromptPack Specification

|                           |             |
| ------------------------- | ----------- |
| **Type**                  | `object`    |
| **Required**              | No          |
| **Additional properties** | Not allowed |

**Description:** Schema for packaging, testing, and running multi-prompt conversational systems with multimodal, workflow, agent, and skills support

**Examples:**

```json
{
    "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
    "id": "customer-support",
    "name": "Customer Support Pack",
    "version": "1.0.0",
    "description": "Complete customer support prompt pack with multiple task types",
    "template_engine": {
        "version": "v1",
        "syntax": "{{variable}}",
        "features": [
            "basic_substitution",
            "fragments"
        ]
    },
    "prompts": {
        "support": {
            "id": "support",
            "name": "Support Bot",
            "description": "General customer support assistant",
            "version": "1.0.0",
            "system_template": "You are a {{role}} assistant for {{company}}.",
            "variables": [
                {
                    "name": "role",
                    "type": "string",
                    "required": true,
                    "description": "The role of the assistant",
                    "example": "support agent"
                }
            ],
            "tools": [
                "lookup_order"
            ],
            "parameters": {
                "temperature": 0.7,
                "max_tokens": 1500
            }
        }
    },
    "tools": {
        "lookup_order": {
            "name": "lookup_order",
            "description": "Look up order details by order ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "The order ID to look up"
                    }
                },
                "required": [
                    "order_id"
                ]
            }
        }
    }
}
```

```json
{
    "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
    "id": "image-analyzer",
    "name": "Image Analysis Pack",
    "version": "1.0.0",
    "description": "Multimodal pack for analyzing images with vision models",
    "template_engine": {
        "version": "v1",
        "syntax": "{{variable}}",
        "features": [
            "basic_substitution"
        ]
    },
    "prompts": {
        "analyze": {
            "id": "analyze",
            "name": "Image Analyzer",
            "description": "Analyzes images and provides detailed descriptions",
            "version": "1.0.0",
            "system_template": "You are an expert image analyst. Provide detailed, accurate descriptions of images.",
            "parameters": {
                "temperature": 0.7,
                "max_tokens": 1000
            },
            "media": {
                "enabled": true,
                "supported_types": [
                    "image"
                ],
                "image": {
                    "max_size_mb": 20,
                    "allowed_formats": [
                        "jpeg",
                        "png",
                        "webp"
                    ],
                    "default_detail": "high",
                    "max_images_per_msg": 5
                },
                "examples": [
                    {
                        "name": "simple-image-analysis",
                        "description": "Basic image analysis with a single photo",
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
                                    "caption": "Sample photo for analysis"
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

| Property                               | Pattern | Type   | Deprecated | Definition                | Title/Description                                                                                                                                                                                                                                                                      |
| -------------------------------------- | ------- | ------ | ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - [$schema](#schema )                  | No      | string | No         | -                         | JSON Schema reference for validation and IDE support                                                                                                                                                                                                                                   |
| + [id](#id )                           | No      | string | No         | -                         | Unique identifier for the pack. Used for referencing and caching. Should be lowercase with hyphens.                                                                                                                                                                                    |
| + [name](#name )                       | No      | string | No         | -                         | Human-readable name for the pack. Displayed in UIs and documentation.                                                                                                                                                                                                                  |
| + [version](#version )                 | No      | string | No         | -                         | Pack version following Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH). Can optionally include 'v' prefix. Use MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. This version tracks the pack as a whole, while individual prompts can have independent versions. |
| - [description](#description )         | No      | string | No         | -                         | Detailed description of the pack's purpose, use cases, and contents. Supports markdown formatting.                                                                                                                                                                                     |
| + [template_engine](#template_engine ) | No      | object | No         | -                         | Template engine configuration shared across all prompts in the pack. Defines how variables are substituted and fragments are resolved.                                                                                                                                                 |
| + [prompts](#prompts )                 | No      | object | No         | -                         | Map of task_type to prompt configuration. Each key is a task type (e.g., 'support', 'sales') and each value is a complete prompt definition. A pack must contain at least one prompt.                                                                                                  |
| - [fragments](#fragments )             | No      | object | No         | -                         | Shared template fragments that can be referenced by any prompt in the pack. Fragments are reusable text blocks resolved at compile time. Keys are fragment names, values are fragment content.                                                                                         |
| - [tools](#tools )                     | No      | object | No         | -                         | Tool definitions that can be referenced by prompts. Tools enable the LLM to call external functions. Keys are tool names, values are tool specifications following the JSON Schema for function calling.                                                                               |
| - [metadata](#metadata )               | No      | object | No         | -                         | Optional pack-level metadata for categorization, discovery, and operational planning.                                                                                                                                                                                                  |
| - [compilation](#compilation )         | No      | object | No         | -                         | Information about when and how this pack was compiled. Generated automatically by the packc compiler.                                                                                                                                                                                  |
| - [evals](#evals )                     | No      | array  | No         | -                         | Pack-level eval definitions that apply across all prompts. Useful for cross-cutting quality concerns like brand consistency or safety checks. Prompt-level evals with the same id override pack-level evals.                                                                           |
| - [workflow](#workflow )               | No      | object | No         | In #/$defs/WorkflowConfig | Workflow configuration defining a state machine over the pack's prompts. Each state references a prompt key and declares event-driven transitions.                                                                                                                                     |
| - [agents](#agents )                   | No      | object | No         | In #/$defs/AgentsConfig   | Agent configuration mapping prompts to A2A-compatible agent definitions. Enables multi-agent orchestration via the Agent-to-Agent protocol.                                                                                                                                            |
| - [skills](#skills )                   | No      | array  | No         | -                         | Skill sources for progressive-disclosure knowledge loading. Each entry is either a string (path or package reference), a SkillPathSource object, or an InlineSkill object.                                                                                                             |

## <a name="schema"></a>1. Property `PromptPack Specification > $schema`

|              |                                                             |
| ------------ | ----------------------------------------------------------- |
| **Type**     | `string`                                                    |
| **Required** | No                                                          |
| **Default**  | `"https://promptpack.org/schema/v1/promptpack.schema.json"` |

**Description:** JSON Schema reference for validation and IDE support

**Example:**

```json
"https://promptpack.org/schema/v1/promptpack.schema.json"
```

## <a name="id"></a>2. Property `PromptPack Specification > id`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Unique identifier for the pack. Used for referencing and caching. Should be lowercase with hyphens.

**Examples:**

```json
"customer-support"
```

```json
"sales-assistant"
```

```json
"technical-help"
```

| Restrictions                      |                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Min length**                    | 1                                                                                                                             |
| **Max length**                    | 100                                                                                                                           |
| **Must match regular expression** | ```^[a-z][a-z0-9-]*$``` [Test](https://regex101.com/?regex=%5E%5Ba-z%5D%5Ba-z0-9-%5D%2A%24&testString=%22customer-support%22) |

## <a name="name"></a>3. Property `PromptPack Specification > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Human-readable name for the pack. Displayed in UIs and documentation.

**Examples:**

```json
"Customer Support Pack"
```

```json
"Sales Assistant"
```

```json
"Technical Support"
```

| Restrictions   |     |
| -------------- | --- |
| **Min length** | 1   |
| **Max length** | 200 |

## <a name="version"></a>4. Property `PromptPack Specification > version`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Pack version following Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH). Can optionally include 'v' prefix. Use MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. This version tracks the pack as a whole, while individual prompts can have independent versions.

**Examples:**

```json
"1.0.0"
```

```json
"v2.1.3"
```

```json
"1.0.0-alpha"
```

```json
"2.0.0-beta.1+build.123"
```

| Restrictions                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^v?(0\|[1-9]\d*)\.(0\|[1-9]\d*)\.(0\|[1-9]\d*)(?:-((?:0\|[1-9]\d*\|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0\|[1-9]\d*\|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$``` [Test](https://regex101.com/?regex=%5Ev%3F%280%7C%5B1-9%5D%5Cd%2A%29%5C.%280%7C%5B1-9%5D%5Cd%2A%29%5C.%280%7C%5B1-9%5D%5Cd%2A%29%28%3F%3A-%28%28%3F%3A0%7C%5B1-9%5D%5Cd%2A%7C%5Cd%2A%5Ba-zA-Z-%5D%5B0-9a-zA-Z-%5D%2A%29%28%3F%3A%5C.%28%3F%3A0%7C%5B1-9%5D%5Cd%2A%7C%5Cd%2A%5Ba-zA-Z-%5D%5B0-9a-zA-Z-%5D%2A%29%29%2A%29%29%3F%28%3F%3A%5C%2B%28%5B0-9a-zA-Z-%5D%2B%28%3F%3A%5C.%5B0-9a-zA-Z-%5D%2B%29%2A%29%29%3F%24&testString=%221.0.0%22) |

## <a name="description"></a>5. Property `PromptPack Specification > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Detailed description of the pack's purpose, use cases, and contents. Supports markdown formatting.

**Example:**

```json
"Complete customer support prompt pack with multiple task types for handling support, sales, and technical inquiries"
```

| Restrictions   |      |
| -------------- | ---- |
| **Max length** | 5000 |

## <a name="template_engine"></a>6. Property `PromptPack Specification > template_engine`

|                           |             |
| ------------------------- | ----------- |
| **Type**                  | `object`    |
| **Required**              | Yes         |
| **Additional properties** | Not allowed |

**Description:** Template engine configuration shared across all prompts in the pack. Defines how variables are substituted and fragments are resolved.

| Property                                 | Pattern | Type                      | Deprecated | Definition | Title/Description                                                                |
| ---------------------------------------- | ------- | ------------------------- | ---------- | ---------- | -------------------------------------------------------------------------------- |
| + [version](#template_engine_version )   | No      | string                    | No         | -          | Template engine version. Use 'v1' for the current stable version.                |
| + [syntax](#template_engine_syntax )     | No      | string                    | No         | -          | Variable substitution syntax pattern. Defines how variables appear in templates. |
| - [features](#template_engine_features ) | No      | array of enum (of string) | No         | -          | Optional list of supported template features beyond basic substitution.          |

### <a name="template_engine_version"></a>6.1. Property `PromptPack Specification > template_engine > version`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Template engine version. Use 'v1' for the current stable version.

**Examples:**

```json
"v1"
```

```json
"v2"
```

### <a name="template_engine_syntax"></a>6.2. Property `PromptPack Specification > template_engine > syntax`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Variable substitution syntax pattern. Defines how variables appear in templates.

**Examples:**

```json
"{{variable}}"
```

```json
"${variable}"
```

```json
"{variable}"
```

### <a name="template_engine_features"></a>6.3. Property `PromptPack Specification > template_engine > features`

|              |                             |
| ------------ | --------------------------- |
| **Type**     | `array of enum (of string)` |
| **Required** | No                          |

**Description:** Optional list of supported template features beyond basic substitution.

**Example:**

```json
[
    "basic_substitution",
    "fragments"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                   | Description |
| ------------------------------------------------- | ----------- |
| [features items](#template_engine_features_items) | -           |

#### <a name="template_engine_features_items"></a>6.3.1. PromptPack Specification > template_engine > features > features items

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

Must be one of:
* "basic_substitution"
* "fragments"
* "conditionals"
* "loops"
* "filters"

## <a name="prompts"></a>7. Property `PromptPack Specification > prompts`

|                           |                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Type**                  | `object`                                                                             |
| **Required**              | Yes                                                                                  |
| **Additional properties** | [Each additional property must conform to the schema](#prompts_additionalProperties) |

**Description:** Map of task_type to prompt configuration. Each key is a task type (e.g., 'support', 'sales') and each value is a complete prompt definition. A pack must contain at least one prompt.

**Example:**

```json
{
    "support": {
        "id": "support",
        "name": "Support Bot",
        "version": "1.0.0",
        "system_template": "You are a helpful assistant."
    }
}
```

| Property                             | Pattern | Type   | Deprecated | Definition        | Title/Description                                                                                                                                                                                                                                                 |
| ------------------------------------ | ------- | ------ | ---------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - - additionalProperties | No      | object | No         | In #/$defs/Prompt | A single prompt configuration within a pack. Each prompt represents a specific task type (e.g., 'support', 'sales') with its own template, variables, tools, and validation rules. Prompts within a pack can evolve independently with their own version numbers. |

### <a name="prompts_additionalProperties"></a>7.1. Property `PromptPack Specification > prompts > Prompt`

|                           |                |
| ------------------------- | -------------- |
| **Type**                  | `object`       |
| **Required**              | No             |
| **Additional properties** | Not allowed    |
| **Defined in**            | #/$defs/Prompt |

**Description:** A single prompt configuration within a pack. Each prompt represents a specific task type (e.g., 'support', 'sales') with its own template, variables, tools, and validation rules. Prompts within a pack can evolve independently with their own version numbers.

| Property                                                            | Pattern | Type            | Deprecated | Definition                | Title/Description                                                                                                                                                                     |
| ------------------------------------------------------------------- | ------- | --------------- | ---------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| + [id](#prompts_additionalProperties_id )                           | No      | string          | No         | -                         | Unique identifier for this prompt, typically matching the task_type key                                                                                                               |
| + [name](#prompts_additionalProperties_name )                       | No      | string          | No         | -                         | Human-readable name for this prompt                                                                                                                                                   |
| - [description](#prompts_additionalProperties_description )         | No      | string          | No         | -                         | Detailed description of this prompt's purpose and behavior                                                                                                                            |
| + [version](#prompts_additionalProperties_version )                 | No      | string          | No         | -                         | Prompt version following Semantic Versioning 2.0.0. Independent from pack version, allowing individual prompts to evolve separately.                                                  |
| + [system_template](#prompts_additionalProperties_system_template ) | No      | string          | No         | -                         | The system prompt template. Use template syntax (e.g., `{{variable}}`) for variable substitution. This is the core instruction that guides the LLM's behavior.                          |
| - [variables](#prompts_additionalProperties_variables )             | No      | array           | No         | -                         | Variable definitions for this prompt. Variables are placeholders in the template that are replaced with actual values at runtime.                                                     |
| - [tools](#prompts_additionalProperties_tools )                     | No      | array of string | No         | -                         | List of tool names that this prompt is allowed to use. Tools must be defined in the pack-level 'tools' object.                                                                        |
| - [tool_policy](#prompts_additionalProperties_tool_policy )         | No      | object          | No         | In #/$defs/ToolPolicy     | Policy governing how tools can be used by this prompt                                                                                                                                 |
| - [pipeline](#prompts_additionalProperties_pipeline )               | No      | object          | No         | In #/$defs/PipelineConfig | Pipeline configuration defining processing stages and middleware                                                                                                                      |
| - [parameters](#prompts_additionalProperties_parameters )           | No      | object          | No         | In #/$defs/Parameters     | LLM generation parameters like temperature and max_tokens                                                                                                                             |
| - [validators](#prompts_additionalProperties_validators )           | No      | array           | No         | -                         | Validation rules (guardrails) applied to LLM responses                                                                                                                                |
| - [evals](#prompts_additionalProperties_evals )                     | No      | array           | No         | -                         | Eval definitions scoped to this prompt. These evals assess the quality of responses generated by this specific prompt. Prompt-level evals with the same id override pack-level evals. |
| - [tested_models](#prompts_additionalProperties_tested_models )     | No      | array           | No         | -                         | Model testing results documenting which models have been tested with this prompt and their performance                                                                                |
| - [model_overrides](#prompts_additionalProperties_model_overrides ) | No      | object          | No         | -                         | Model-specific template modifications. Keys are model names (e.g., 'claude-3-opus', 'gpt-4'), values are override configurations.                                                     |
| - [media](#prompts_additionalProperties_media )                     | No      | object          | No         | In #/$defs/MediaConfig    | Multimodal content configuration for this prompt. Defines supported media types and validation rules.                                                                                 |

#### <a name="prompts_additionalProperties_id"></a>7.1.1. Property `PromptPack Specification > prompts > additionalProperties > id`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Unique identifier for this prompt, typically matching the task_type key

**Examples:**

```json
"support"
```

```json
"sales"
```

```json
"technical_support"
```

| Restrictions                      |                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-z][a-z0-9_-]*$``` [Test](https://regex101.com/?regex=%5E%5Ba-z%5D%5Ba-z0-9_-%5D%2A%24&testString=%22support%22) |

#### <a name="prompts_additionalProperties_name"></a>7.1.2. Property `PromptPack Specification > prompts > additionalProperties > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Human-readable name for this prompt

**Examples:**

```json
"Support Bot"
```

```json
"Sales Assistant"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

#### <a name="prompts_additionalProperties_description"></a>7.1.3. Property `PromptPack Specification > prompts > additionalProperties > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Detailed description of this prompt's purpose and behavior

**Example:**

```json
"General customer support assistant for handling inquiries"
```

#### <a name="prompts_additionalProperties_version"></a>7.1.4. Property `PromptPack Specification > prompts > additionalProperties > version`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Prompt version following Semantic Versioning 2.0.0. Independent from pack version, allowing individual prompts to evolve separately.

**Examples:**

```json
"1.0.0"
```

```json
"v2.1.0"
```

```json
"1.5.2-beta"
```

| Restrictions                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^v?(0\|[1-9]\d*)\.(0\|[1-9]\d*)\.(0\|[1-9]\d*)(?:-((?:0\|[1-9]\d*\|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0\|[1-9]\d*\|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$``` [Test](https://regex101.com/?regex=%5Ev%3F%280%7C%5B1-9%5D%5Cd%2A%29%5C.%280%7C%5B1-9%5D%5Cd%2A%29%5C.%280%7C%5B1-9%5D%5Cd%2A%29%28%3F%3A-%28%28%3F%3A0%7C%5B1-9%5D%5Cd%2A%7C%5Cd%2A%5Ba-zA-Z-%5D%5B0-9a-zA-Z-%5D%2A%29%28%3F%3A%5C.%28%3F%3A0%7C%5B1-9%5D%5Cd%2A%7C%5Cd%2A%5Ba-zA-Z-%5D%5B0-9a-zA-Z-%5D%2A%29%29%2A%29%29%3F%28%3F%3A%5C%2B%28%5B0-9a-zA-Z-%5D%2B%28%3F%3A%5C.%5B0-9a-zA-Z-%5D%2B%29%2A%29%29%3F%24&testString=%221.0.0%22) |

#### <a name="prompts_additionalProperties_system_template"></a>7.1.5. Property `PromptPack Specification > prompts > additionalProperties > system_template`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** The system prompt template. Use template syntax (e.g., `{{variable}}`) for variable substitution. This is the core instruction that guides the LLM's behavior.

**Examples:**

```json
"You are a {{role}} assistant for {{company}}.\\n\\nProvide helpful, professional support."
```

```json
"You are an expert in {{domain}}. Help users with {{task_description}}."
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

#### <a name="prompts_additionalProperties_variables"></a>7.1.6. Property `PromptPack Specification > prompts > additionalProperties > variables`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Variable definitions for this prompt. Variables are placeholders in the template that are replaced with actual values at runtime.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                           | Description                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Variable](#prompts_additionalProperties_variables_items) | A template variable definition with type information and validation rules. Variables are replaced with actual values when the prompt is rendered. |

##### <a name="prompts_additionalProperties_variables_items"></a>7.1.6.1. PromptPack Specification > prompts > additionalProperties > variables > Variable

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Not allowed      |
| **Defined in**            | #/$defs/Variable |

**Description:** A template variable definition with type information and validation rules. Variables are replaced with actual values when the prompt is rendered.

| Property                                                                    | Pattern | Type             | Deprecated | Definition | Title/Description                                                                              |
| --------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------- |
| + [name](#prompts_additionalProperties_variables_items_name )               | No      | string           | No         | -          | Variable name used in templates (e.g., `{{name}}`)                                               |
| + [type](#prompts_additionalProperties_variables_items_type )               | No      | enum (of string) | No         | -          | Data type of the variable                                                                      |
| + [required](#prompts_additionalProperties_variables_items_required )       | No      | boolean          | No         | -          | Whether this variable must be provided. Required variables without values will cause an error. |
| - [default](#prompts_additionalProperties_variables_items_default )         | No      | object           | No         | -          | Default value used when variable is not provided. Cannot be set if required is true.           |
| - [description](#prompts_additionalProperties_variables_items_description ) | No      | string           | No         | -          | Human-readable description of the variable's purpose                                           |
| - [example](#prompts_additionalProperties_variables_items_example )         | No      | object           | No         | -          | Example value showing expected format and content                                              |
| - [validation](#prompts_additionalProperties_variables_items_validation )   | No      | object           | No         | -          | Validation rules applied to the variable value at runtime                                      |

###### <a name="prompts_additionalProperties_variables_items_name"></a>7.1.6.1.1. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Variable name used in templates (e.g., `{{name}}`)

**Examples:**

```json
"role"
```

```json
"company"
```

```json
"customer_name"
```

| Restrictions                      |                                                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-zA-Z_][a-zA-Z0-9_]*$``` [Test](https://regex101.com/?regex=%5E%5Ba-zA-Z_%5D%5Ba-zA-Z0-9_%5D%2A%24&testString=%22role%22) |

###### <a name="prompts_additionalProperties_variables_items_type"></a>7.1.6.1.2. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > type`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** Data type of the variable

**Examples:**

```json
"string"
```

```json
"number"
```

Must be one of:
* "string"
* "number"
* "boolean"
* "object"
* "array"

###### <a name="prompts_additionalProperties_variables_items_required"></a>7.1.6.1.3. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > required`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | Yes       |

**Description:** Whether this variable must be provided. Required variables without values will cause an error.

###### <a name="prompts_additionalProperties_variables_items_default"></a>7.1.6.1.4. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > default`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Default value used when variable is not provided. Cannot be set if required is true.

**Examples:**

```json
"TechCo"
```

```json
42
```

```json
true
```

```json
{
    "key": "value"
}
```

###### <a name="prompts_additionalProperties_variables_items_description"></a>7.1.6.1.5. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Human-readable description of the variable's purpose

**Examples:**

```json
"The role of the assistant"
```

```json
"Customer's account ID"
```

###### <a name="prompts_additionalProperties_variables_items_example"></a>7.1.6.1.6. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > example`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Example value showing expected format and content

**Examples:**

```json
"support agent"
```

```json
"12345"
```

```json
"john@example.com"
```

###### <a name="prompts_additionalProperties_variables_items_validation"></a>7.1.6.1.7. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation`

|                           |             |
| ------------------------- | ----------- |
| **Type**                  | `object`    |
| **Required**              | No          |
| **Additional properties** | Not allowed |

**Description:** Validation rules applied to the variable value at runtime

| Property                                                                             | Pattern | Type    | Deprecated | Definition | Title/Description                             |
| ------------------------------------------------------------------------------------ | ------- | ------- | ---------- | ---------- | --------------------------------------------- |
| - [pattern](#prompts_additionalProperties_variables_items_validation_pattern )       | No      | string  | No         | -          | Regular expression pattern (for string types) |
| - [min_length](#prompts_additionalProperties_variables_items_validation_min_length ) | No      | integer | No         | -          | Minimum string length (for string types)      |
| - [max_length](#prompts_additionalProperties_variables_items_validation_max_length ) | No      | integer | No         | -          | Maximum string length (for string types)      |
| - [minimum](#prompts_additionalProperties_variables_items_validation_minimum )       | No      | number  | No         | -          | Minimum numeric value (for number types)      |
| - [maximum](#prompts_additionalProperties_variables_items_validation_maximum )       | No      | number  | No         | -          | Maximum numeric value (for number types)      |
| - [enum](#prompts_additionalProperties_variables_items_validation_enum )             | No      | array   | No         | -          | List of allowed values                        |

###### <a name="prompts_additionalProperties_variables_items_validation_pattern"></a>7.1.6.1.7.1. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > pattern`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Regular expression pattern (for string types)

**Examples:**

```json
"^[a-zA-Z\\\\s]+$"
```

```json
"^\\\\d{5}$"
```

```json
"^[a-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,}$"
```

###### <a name="prompts_additionalProperties_variables_items_validation_min_length"></a>7.1.6.1.7.2. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > min_length`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Minimum string length (for string types)

**Examples:**

```json
3
```

```json
10
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

###### <a name="prompts_additionalProperties_variables_items_validation_max_length"></a>7.1.6.1.7.3. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > max_length`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum string length (for string types)

**Examples:**

```json
50
```

```json
1000
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_variables_items_validation_minimum"></a>7.1.6.1.7.4. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > minimum`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Minimum numeric value (for number types)

**Examples:**

```json
0
```

```json
1
```

```json
100
```

###### <a name="prompts_additionalProperties_variables_items_validation_maximum"></a>7.1.6.1.7.5. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > maximum`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Maximum numeric value (for number types)

**Examples:**

```json
100
```

```json
1000
```

###### <a name="prompts_additionalProperties_variables_items_validation_enum"></a>7.1.6.1.7.6. Property `PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > enum`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** List of allowed values

**Examples:**

```json
[
    "low",
    "medium",
    "high"
]
```

```json
[
    1,
    2,
    3
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                   | Description |
| --------------------------------------------------------------------------------- | ----------- |
| [enum items](#prompts_additionalProperties_variables_items_validation_enum_items) | -           |

###### <a name="prompts_additionalProperties_variables_items_validation_enum_items"></a>7.1.6.1.7.6.1. PromptPack Specification > prompts > additionalProperties > variables > variables items > validation > enum > enum items

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

#### <a name="prompts_additionalProperties_tools"></a>7.1.7. Property `PromptPack Specification > prompts > additionalProperties > tools`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of tool names that this prompt is allowed to use. Tools must be defined in the pack-level 'tools' object.

**Examples:**

```json
[
    "lookup_order",
    "create_ticket"
]
```

```json
[
    "search_products",
    "get_pricing"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                          | Description |
| -------------------------------------------------------- | ----------- |
| [tools items](#prompts_additionalProperties_tools_items) | -           |

##### <a name="prompts_additionalProperties_tools_items"></a>7.1.7.1. PromptPack Specification > prompts > additionalProperties > tools > tools items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

#### <a name="prompts_additionalProperties_tool_policy"></a>7.1.8. Property `PromptPack Specification > prompts > additionalProperties > tool_policy`

|                           |                    |
| ------------------------- | ------------------ |
| **Type**                  | `object`           |
| **Required**              | No                 |
| **Additional properties** | Not allowed        |
| **Defined in**            | #/$defs/ToolPolicy |

**Description:** Policy governing how tools can be used by this prompt

| Property                                                                                        | Pattern | Type             | Deprecated | Definition | Title/Description                                                                               |
| ----------------------------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ----------------------------------------------------------------------------------------------- |
| - [tool_choice](#prompts_additionalProperties_tool_policy_tool_choice )                         | No      | enum (of string) | No         | -          | 'auto' lets the LLM decide when to use tools, 'required' forces tool use, 'none' disables tools |
| - [max_rounds](#prompts_additionalProperties_tool_policy_max_rounds )                           | No      | integer          | No         | -          | Maximum number of LLM → tool → LLM cycles allowed per turn                                      |
| - [max_tool_calls_per_turn](#prompts_additionalProperties_tool_policy_max_tool_calls_per_turn ) | No      | integer          | No         | -          | Maximum number of tool calls allowed in a single turn                                           |
| - [blocklist](#prompts_additionalProperties_tool_policy_blocklist )                             | No      | array of string  | No         | -          | List of tool names that are not allowed for this prompt (overrides tools list)                  |

##### <a name="prompts_additionalProperties_tool_policy_tool_choice"></a>7.1.8.1. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > tool_choice`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |
| **Default**  | `"auto"`           |

**Description:** 'auto' lets the LLM decide when to use tools, 'required' forces tool use, 'none' disables tools

**Examples:**

```json
"auto"
```

```json
"required"
```

Must be one of:
* "auto"
* "required"
* "none"

##### <a name="prompts_additionalProperties_tool_policy_max_rounds"></a>7.1.8.2. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > max_rounds`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |
| **Default**  | `5`       |

**Description:** Maximum number of LLM → tool → LLM cycles allowed per turn

**Examples:**

```json
3
```

```json
5
```

```json
10
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

##### <a name="prompts_additionalProperties_tool_policy_max_tool_calls_per_turn"></a>7.1.8.3. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > max_tool_calls_per_turn`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |
| **Default**  | `10`      |

**Description:** Maximum number of tool calls allowed in a single turn

**Examples:**

```json
1
```

```json
5
```

```json
10
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

##### <a name="prompts_additionalProperties_tool_policy_blocklist"></a>7.1.8.4. Property `PromptPack Specification > prompts > additionalProperties > tool_policy > blocklist`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of tool names that are not allowed for this prompt (overrides tools list)

**Example:**

```json
[
    "dangerous_tool",
    "delete_data"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                              | Description |
| ---------------------------------------------------------------------------- | ----------- |
| [blocklist items](#prompts_additionalProperties_tool_policy_blocklist_items) | -           |

###### <a name="prompts_additionalProperties_tool_policy_blocklist_items"></a>7.1.8.4.1. PromptPack Specification > prompts > additionalProperties > tool_policy > blocklist > blocklist items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

#### <a name="prompts_additionalProperties_pipeline"></a>7.1.9. Property `PromptPack Specification > prompts > additionalProperties > pipeline`

|                           |                        |
| ------------------------- | ---------------------- |
| **Type**                  | `object`               |
| **Required**              | No                     |
| **Additional properties** | Not allowed            |
| **Defined in**            | #/$defs/PipelineConfig |

**Description:** Pipeline configuration defining processing stages and middleware

| Property                                                           | Pattern | Type            | Deprecated | Definition | Title/Description                                                                            |
| ------------------------------------------------------------------ | ------- | --------------- | ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| + [stages](#prompts_additionalProperties_pipeline_stages )         | No      | array of string | No         | -          | Ordered list of pipeline stages. Common stages: 'template', 'provider', 'validator'          |
| - [middleware](#prompts_additionalProperties_pipeline_middleware ) | No      | array           | No         | -          | Middleware components with their configurations. Applied in order during pipeline execution. |

##### <a name="prompts_additionalProperties_pipeline_stages"></a>7.1.9.1. Property `PromptPack Specification > prompts > additionalProperties > pipeline > stages`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | Yes               |

**Description:** Ordered list of pipeline stages. Common stages: 'template', 'provider', 'validator'

**Example:**

```json
[
    "template",
    "provider",
    "validator"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                     | Description |
| ------------------------------------------------------------------- | ----------- |
| [stages items](#prompts_additionalProperties_pipeline_stages_items) | -           |

###### <a name="prompts_additionalProperties_pipeline_stages_items"></a>7.1.9.1.1. PromptPack Specification > prompts > additionalProperties > pipeline > stages > stages items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

##### <a name="prompts_additionalProperties_pipeline_middleware"></a>7.1.9.2. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Middleware components with their configurations. Applied in order during pipeline execution.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                             | Description                                                     |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [MiddlewareConfig](#prompts_additionalProperties_pipeline_middleware_items) | Configuration for a single middleware component in the pipeline |

###### <a name="prompts_additionalProperties_pipeline_middleware_items"></a>7.1.9.2.1. PromptPack Specification > prompts > additionalProperties > pipeline > middleware > MiddlewareConfig

|                           |                          |
| ------------------------- | ------------------------ |
| **Type**                  | `object`                 |
| **Required**              | No                       |
| **Additional properties** | Not allowed              |
| **Defined in**            | #/$defs/MiddlewareConfig |

**Description:** Configuration for a single middleware component in the pipeline

| Property                                                                    | Pattern | Type   | Deprecated | Definition | Title/Description                              |
| --------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ---------------------------------------------- |
| + [type](#prompts_additionalProperties_pipeline_middleware_items_type )     | No      | string | No         | -          | Middleware type identifier                     |
| - [config](#prompts_additionalProperties_pipeline_middleware_items_config ) | No      | object | No         | -          | Type-specific configuration for the middleware |

###### <a name="prompts_additionalProperties_pipeline_middleware_items_type"></a>7.1.9.2.1.1. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware > middleware items > type`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Middleware type identifier

**Examples:**

```json
"template"
```

```json
"provider"
```

```json
"validator"
```

```json
"custom"
```

###### <a name="prompts_additionalProperties_pipeline_middleware_items_config"></a>7.1.9.2.1.2. Property `PromptPack Specification > prompts > additionalProperties > pipeline > middleware > middleware items > config`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Type-specific configuration for the middleware

| Property                                                                                   | Pattern | Type   | Deprecated | Definition | Title/Description |
| ------------------------------------------------------------------------------------------ | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

#### <a name="prompts_additionalProperties_parameters"></a>7.1.10. Property `PromptPack Specification > prompts > additionalProperties > parameters`

|                           |                    |
| ------------------------- | ------------------ |
| **Type**                  | `object`           |
| **Required**              | No                 |
| **Additional properties** | Not allowed        |
| **Defined in**            | #/$defs/Parameters |

**Description:** LLM generation parameters like temperature and max_tokens

| Property                                                                           | Pattern | Type            | Deprecated | Definition | Title/Description                                                                                   |
| ---------------------------------------------------------------------------------- | ------- | --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------- |
| - [temperature](#prompts_additionalProperties_parameters_temperature )             | No      | number          | No         | -          | Sampling temperature (0-2). Higher values make output more random, lower values more deterministic. |
| - [max_tokens](#prompts_additionalProperties_parameters_max_tokens )               | No      | integer         | No         | -          | Maximum number of tokens to generate in the response                                                |
| - [top_p](#prompts_additionalProperties_parameters_top_p )                         | No      | number          | No         | -          | Nucleus sampling parameter (0-1). Alternative to temperature for controlling randomness.            |
| - [top_k](#prompts_additionalProperties_parameters_top_k )                         | No      | integer or null | No         | -          | Top-k sampling parameter. Limits to top K tokens. Null means no limit.                              |
| - [frequency_penalty](#prompts_additionalProperties_parameters_frequency_penalty ) | No      | number          | No         | -          | Penalty for token frequency (-2 to 2). Positive values reduce repetition.                           |
| - [presence_penalty](#prompts_additionalProperties_parameters_presence_penalty )   | No      | number          | No         | -          | Penalty for token presence (-2 to 2). Positive values encourage new topics.                         |

##### <a name="prompts_additionalProperties_parameters_temperature"></a>7.1.10.1. Property `PromptPack Specification > prompts > additionalProperties > parameters > temperature`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Sampling temperature (0-2). Higher values make output more random, lower values more deterministic.

**Examples:**

```json
0.7
```

```json
1.0
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |
| **Maximum**  | &le; 2 |

##### <a name="prompts_additionalProperties_parameters_max_tokens"></a>7.1.10.2. Property `PromptPack Specification > prompts > additionalProperties > parameters > max_tokens`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum number of tokens to generate in the response

**Examples:**

```json
100
```

```json
1000
```

```json
4000
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

##### <a name="prompts_additionalProperties_parameters_top_p"></a>7.1.10.3. Property `PromptPack Specification > prompts > additionalProperties > parameters > top_p`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Nucleus sampling parameter (0-1). Alternative to temperature for controlling randomness.

**Examples:**

```json
0.9
```

```json
1.0
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |
| **Maximum**  | &le; 1 |

##### <a name="prompts_additionalProperties_parameters_top_k"></a>7.1.10.4. Property `PromptPack Specification > prompts > additionalProperties > parameters > top_k`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `integer or null` |
| **Required** | No                |

**Description:** Top-k sampling parameter. Limits to top K tokens. Null means no limit.

**Examples:**

```json
40
```

```json
100
```

```json
null
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

##### <a name="prompts_additionalProperties_parameters_frequency_penalty"></a>7.1.10.5. Property `PromptPack Specification > prompts > additionalProperties > parameters > frequency_penalty`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Penalty for token frequency (-2 to 2). Positive values reduce repetition.

**Examples:**

```json
0
```

```json
0.5
```

| Restrictions |         |
| ------------ | ------- |
| **Minimum**  | &ge; -2 |
| **Maximum**  | &le; 2  |

##### <a name="prompts_additionalProperties_parameters_presence_penalty"></a>7.1.10.6. Property `PromptPack Specification > prompts > additionalProperties > parameters > presence_penalty`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Penalty for token presence (-2 to 2). Positive values encourage new topics.

**Examples:**

```json
0
```

```json
0.5
```

| Restrictions |         |
| ------------ | ------- |
| **Minimum**  | &ge; -2 |
| **Maximum**  | &le; 2  |

#### <a name="prompts_additionalProperties_validators"></a>7.1.11. Property `PromptPack Specification > prompts > additionalProperties > validators`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Validation rules (guardrails) applied to LLM responses

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                             | Description                                                                                                                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Validator](#prompts_additionalProperties_validators_items) | A validation rule (guardrail) applied to LLM responses. Validators can check content, length, format, and other constraints to ensure response quality and safety. |

##### <a name="prompts_additionalProperties_validators_items"></a>7.1.11.1. PromptPack Specification > prompts > additionalProperties > validators > Validator

|                           |                   |
| ------------------------- | ----------------- |
| **Type**                  | `object`          |
| **Required**              | No                |
| **Additional properties** | Not allowed       |
| **Defined in**            | #/$defs/Validator |

**Description:** A validation rule (guardrail) applied to LLM responses. Validators can check content, length, format, and other constraints to ensure response quality and safety.

| Property                                                                                 | Pattern | Type             | Deprecated | Definition | Title/Description                                                                                |
| ---------------------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------ |
| + [type](#prompts_additionalProperties_validators_items_type )                           | No      | enum (of string) | No         | -          | Type of validation to perform                                                                    |
| + [enabled](#prompts_additionalProperties_validators_items_enabled )                     | No      | boolean          | No         | -          | Whether this validator is active. Allows temporarily disabling validators without removing them. |
| - [fail_on_violation](#prompts_additionalProperties_validators_items_fail_on_violation ) | No      | boolean          | No         | -          | If true, validation failures cause an error. If false, violations are logged but allowed.        |
| - [params](#prompts_additionalProperties_validators_items_params )                       | No      | object           | No         | -          | Validator-specific parameters                                                                    |

###### <a name="prompts_additionalProperties_validators_items_type"></a>7.1.11.1.1. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > type`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** Type of validation to perform

**Examples:**

```json
"banned_words"
```

```json
"max_length"
```

Must be one of:
* "banned_words"
* "max_length"
* "min_length"
* "regex_match"
* "json_schema"
* "sentiment"
* "toxicity"
* "pii_detection"
* "custom"

###### <a name="prompts_additionalProperties_validators_items_enabled"></a>7.1.11.1.2. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > enabled`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | Yes       |

**Description:** Whether this validator is active. Allows temporarily disabling validators without removing them.

###### <a name="prompts_additionalProperties_validators_items_fail_on_violation"></a>7.1.11.1.3. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > fail_on_violation`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** If true, validation failures cause an error. If false, violations are logged but allowed.

###### <a name="prompts_additionalProperties_validators_items_params"></a>7.1.11.1.4. Property `PromptPack Specification > prompts > additionalProperties > validators > validators items > params`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Validator-specific parameters

**Examples:**

```json
{
    "words": [
        "inappropriate",
        "banned"
    ]
}
```

```json
{
    "max_characters": 1000,
    "max_tokens": 250
}
```

| Property                                                                          | Pattern | Type   | Deprecated | Definition | Title/Description |
| --------------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

#### <a name="prompts_additionalProperties_evals"></a>7.1.12. Property `PromptPack Specification > prompts > additionalProperties > evals`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Eval definitions scoped to this prompt. These evals assess the quality of responses generated by this specific prompt. Prompt-level evals with the same id override pack-level evals.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                   | Description                                                                                                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Eval](#prompts_additionalProperties_evals_items) | An eval definition that declares how to assess LLM output quality. Evals run asynchronously and produce scores or metrics, unlike validators which run inline and block. |

##### <a name="prompts_additionalProperties_evals_items"></a>7.1.12.1. PromptPack Specification > prompts > additionalProperties > evals > Eval

|                           |              |
| ------------------------- | ------------ |
| **Type**                  | `object`     |
| **Required**              | No           |
| **Additional properties** | Not allowed  |
| **Defined in**            | #/$defs/Eval |

**Description:** An eval definition that declares how to assess LLM output quality. Evals run asynchronously and produce scores or metrics, unlike validators which run inline and block.

| Property                                                                            | Pattern | Type             | Deprecated | Definition           | Title/Description                                                                                                                        |
| ----------------------------------------------------------------------------------- | ------- | ---------------- | ---------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| + [id](#prompts_additionalProperties_evals_items_id )                               | No      | string           | No         | -                    | Unique identifier for this eval within its scope (prompt-level or pack-level).                                                           |
| - [description](#prompts_additionalProperties_evals_items_description )             | No      | string           | No         | -                    | Human-readable description of what this eval measures and why it matters.                                                                |
| + [type](#prompts_additionalProperties_evals_items_type )                           | No      | string           | No         | -                    | The assertion type that determines how this eval is executed. Not an enum — runtimes define and register their own types.                |
| + [trigger](#prompts_additionalProperties_evals_items_trigger )                     | No      | enum (of string) | No         | -                    | When this eval should be triggered.                                                                                                      |
| - [sample_percentage](#prompts_additionalProperties_evals_items_sample_percentage ) | No      | number           | No         | -                    | Percentage of turns or sessions to sample when trigger is sample_turns or sample_sessions. Ignored for other trigger types.              |
| - [enabled](#prompts_additionalProperties_evals_items_enabled )                     | No      | boolean          | No         | -                    | Whether this eval is active. Allows temporarily disabling evals without removing them.                                                   |
| - [params](#prompts_additionalProperties_evals_items_params )                       | No      | object           | No         | -                    | Type-specific configuration for the eval. Structure depends on the eval type — runtimes interpret these based on the type field.         |
| - [metric](#prompts_additionalProperties_evals_items_metric )                       | No      | object           | No         | In #/$defs/MetricDef | Prometheus-style metric declaration describing the output shape of this eval. Runtimes use this to expose results to monitoring systems. |

###### <a name="prompts_additionalProperties_evals_items_id"></a>7.1.12.1.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > id`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Unique identifier for this eval within its scope (prompt-level or pack-level).

**Examples:**

```json
"tone-check"
```

```json
"brand-consistency"
```

```json
"json_format"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

###### <a name="prompts_additionalProperties_evals_items_description"></a>7.1.12.1.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Human-readable description of what this eval measures and why it matters.

###### <a name="prompts_additionalProperties_evals_items_type"></a>7.1.12.1.3. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > type`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** The assertion type that determines how this eval is executed. Not an enum — runtimes define and register their own types.

**Examples:**

```json
"llm_judge"
```

```json
"cosine_similarity"
```

```json
"regex"
```

```json
"contains"
```

```json
"json_valid"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

###### <a name="prompts_additionalProperties_evals_items_trigger"></a>7.1.12.1.4. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > trigger`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** When this eval should be triggered.

Must be one of:
* "every_turn"
* "on_session_complete"
* "sample_turns"
* "sample_sessions"

###### <a name="prompts_additionalProperties_evals_items_sample_percentage"></a>7.1.12.1.5. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > sample_percentage`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |
| **Default**  | `5`      |

**Description:** Percentage of turns or sessions to sample when trigger is sample_turns or sample_sessions. Ignored for other trigger types.

**Examples:**

```json
5
```

```json
10
```

```json
25
```

```json
50
```

| Restrictions |          |
| ------------ | -------- |
| **Minimum**  | &ge; 0   |
| **Maximum**  | &le; 100 |

###### <a name="prompts_additionalProperties_evals_items_enabled"></a>7.1.12.1.6. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > enabled`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `true`    |

**Description:** Whether this eval is active. Allows temporarily disabling evals without removing them.

###### <a name="prompts_additionalProperties_evals_items_params"></a>7.1.12.1.7. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > params`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Type-specific configuration for the eval. Structure depends on the eval type — runtimes interpret these based on the type field.

**Examples:**

```json
{
    "judge_prompt": "Rate the response tone on a scale of 1-5 for professionalism.",
    "model": "gpt-4o",
    "passing_score": 4
}
```

```json
{
    "patterns": [
        "hello",
        "welcome"
    ]
}
```

| Property                                                                     | Pattern | Type   | Deprecated | Definition | Title/Description |
| ---------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

###### <a name="prompts_additionalProperties_evals_items_metric"></a>7.1.12.1.8. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric`

|                           |                   |
| ------------------------- | ----------------- |
| **Type**                  | `object`          |
| **Required**              | No                |
| **Additional properties** | Any type allowed  |
| **Defined in**            | #/$defs/MetricDef |

**Description:** Prometheus-style metric declaration describing the output shape of this eval. Runtimes use this to expose results to monitoring systems.

| Property                                                                     | Pattern | Type             | Deprecated | Definition | Title/Description                                                                                    |
| ---------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| + [name](#prompts_additionalProperties_evals_items_metric_name )             | No      | string           | No         | -          | Metric name. Should follow Prometheus naming conventions (snake_case, namespace prefix recommended). |
| + [type](#prompts_additionalProperties_evals_items_metric_type )             | No      | enum (of string) | No         | -          | Prometheus metric type that describes the value semantics.                                           |
| - [range](#prompts_additionalProperties_evals_items_metric_range )           | No      | object           | No         | -          | Optional value bounds. Useful for gauge metrics with known ranges.                                   |
| - - additionalProperties | No      | object           | No         | -          | -                                                                                                    |

###### <a name="prompts_additionalProperties_evals_items_metric_name"></a>7.1.12.1.8.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Metric name. Should follow Prometheus naming conventions (snake_case, namespace prefix recommended).

**Examples:**

```json
"promptpack_tone_score"
```

```json
"promptpack_brand_consistency"
```

```json
"promptpack_json_valid"
```

| Restrictions                      |                                                                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-zA-Z_:][a-zA-Z0-9_:]*$``` [Test](https://regex101.com/?regex=%5E%5Ba-zA-Z_%3A%5D%5Ba-zA-Z0-9_%3A%5D%2A%24&testString=%22promptpack_tone_score%22) |

###### <a name="prompts_additionalProperties_evals_items_metric_type"></a>7.1.12.1.8.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > type`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** Prometheus metric type that describes the value semantics.

Must be one of:
* "gauge"
* "counter"
* "histogram"
* "boolean"

###### <a name="prompts_additionalProperties_evals_items_metric_range"></a>7.1.12.1.8.3. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Optional value bounds. Useful for gauge metrics with known ranges.

| Property                                                             | Pattern | Type   | Deprecated | Definition | Title/Description      |
| -------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ---------------------- |
| - [min](#prompts_additionalProperties_evals_items_metric_range_min ) | No      | number | No         | -          | Minimum expected value |
| - [max](#prompts_additionalProperties_evals_items_metric_range_max ) | No      | number | No         | -          | Maximum expected value |

###### <a name="prompts_additionalProperties_evals_items_metric_range_min"></a>7.1.12.1.8.3.1. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range > min`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Minimum expected value

###### <a name="prompts_additionalProperties_evals_items_metric_range_max"></a>7.1.12.1.8.3.2. Property `PromptPack Specification > prompts > additionalProperties > evals > evals items > metric > range > max`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Maximum expected value

#### <a name="prompts_additionalProperties_tested_models"></a>7.1.13. Property `PromptPack Specification > prompts > additionalProperties > tested_models`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Model testing results documenting which models have been tested with this prompt and their performance

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                  | Description                                                                                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [TestedModel](#prompts_additionalProperties_tested_models_items) | Testing results for a specific model. Documents which models have been tested with this prompt and their performance metrics. |

##### <a name="prompts_additionalProperties_tested_models_items"></a>7.1.13.1. PromptPack Specification > prompts > additionalProperties > tested_models > TestedModel

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/TestedModel |

**Description:** Testing results for a specific model. Documents which models have been tested with this prompt and their performance metrics.

| Property                                                                              | Pattern | Type   | Deprecated | Definition | Title/Description                                        |
| ------------------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | -------------------------------------------------------- |
| + [provider](#prompts_additionalProperties_tested_models_items_provider )             | No      | string | No         | -          | LLM provider name                                        |
| + [model](#prompts_additionalProperties_tested_models_items_model )                   | No      | string | No         | -          | Specific model identifier                                |
| + [date](#prompts_additionalProperties_tested_models_items_date )                     | No      | string | No         | -          | Date when the model was tested (YYYY-MM-DD)              |
| - [success_rate](#prompts_additionalProperties_tested_models_items_success_rate )     | No      | number | No         | -          | Success rate (0-1) from test runs                        |
| - [avg_tokens](#prompts_additionalProperties_tested_models_items_avg_tokens )         | No      | number | No         | -          | Average number of tokens used per response               |
| - [avg_cost](#prompts_additionalProperties_tested_models_items_avg_cost )             | No      | number | No         | -          | Average cost per execution in USD                        |
| - [avg_latency_ms](#prompts_additionalProperties_tested_models_items_avg_latency_ms ) | No      | number | No         | -          | Average response latency in milliseconds                 |
| - [notes](#prompts_additionalProperties_tested_models_items_notes )                   | No      | string | No         | -          | Additional notes about model performance or observations |

###### <a name="prompts_additionalProperties_tested_models_items_provider"></a>7.1.13.1.1. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > provider`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** LLM provider name

**Examples:**

```json
"openai"
```

```json
"anthropic"
```

```json
"azure"
```

```json
"bedrock"
```

###### <a name="prompts_additionalProperties_tested_models_items_model"></a>7.1.13.1.2. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > model`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Specific model identifier

**Examples:**

```json
"gpt-4"
```

```json
"gpt-3.5-turbo"
```

```json
"claude-3-opus"
```

```json
"claude-3-sonnet"
```

###### <a name="prompts_additionalProperties_tested_models_items_date"></a>7.1.13.1.3. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > date`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |
| **Format**   | `date`   |

**Description:** Date when the model was tested (YYYY-MM-DD)

**Examples:**

```json
"2025-10-31"
```

```json
"2025-12-01"
```

###### <a name="prompts_additionalProperties_tested_models_items_success_rate"></a>7.1.13.1.4. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > success_rate`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Success rate (0-1) from test runs

**Examples:**

```json
0.95
```

```json
0.87
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |
| **Maximum**  | &le; 1 |

###### <a name="prompts_additionalProperties_tested_models_items_avg_tokens"></a>7.1.13.1.5. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_tokens`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Average number of tokens used per response

**Examples:**

```json
150
```

```json
500
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

###### <a name="prompts_additionalProperties_tested_models_items_avg_cost"></a>7.1.13.1.6. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_cost`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Average cost per execution in USD

**Examples:**

```json
0.0045
```

```json
0.012
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

###### <a name="prompts_additionalProperties_tested_models_items_avg_latency_ms"></a>7.1.13.1.7. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > avg_latency_ms`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Average response latency in milliseconds

**Examples:**

```json
1200
```

```json
3500
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

###### <a name="prompts_additionalProperties_tested_models_items_notes"></a>7.1.13.1.8. Property `PromptPack Specification > prompts > additionalProperties > tested_models > tested_models items > notes`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Additional notes about model performance or observations

#### <a name="prompts_additionalProperties_model_overrides"></a>7.1.14. Property `PromptPack Specification > prompts > additionalProperties > model_overrides`

|                           |                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                                                                  |
| **Required**              | No                                                                                                                        |
| **Additional properties** | [Each additional property must conform to the schema](#prompts_additionalProperties_model_overrides_additionalProperties) |

**Description:** Model-specific template modifications. Keys are model names (e.g., 'claude-3-opus', 'gpt-4'), values are override configurations.

| Property                                                                  | Pattern | Type   | Deprecated | Definition               | Title/Description                                                                                                         |
| ------------------------------------------------------------------------- | ------- | ------ | ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| - - additionalProperties | No      | object | No         | In #/$defs/ModelOverride | Model-specific template modifications. Allows customizing prompts for specific models without changing the base template. |

##### <a name="prompts_additionalProperties_model_overrides_additionalProperties"></a>7.1.14.1. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > ModelOverride`

|                           |                       |
| ------------------------- | --------------------- |
| **Type**                  | `object`              |
| **Required**              | No                    |
| **Additional properties** | Not allowed           |
| **Defined in**            | #/$defs/ModelOverride |

**Description:** Model-specific template modifications. Allows customizing prompts for specific models without changing the base template.

| Property                                                                                                               | Pattern | Type   | Deprecated | Definition                                                      | Title/Description                                                                          |
| ---------------------------------------------------------------------------------------------------------------------- | ------- | ------ | ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| - [system_template_prefix](#prompts_additionalProperties_model_overrides_additionalProperties_system_template_prefix ) | No      | string | No         | -                                                               | Text prepended to the system template for this model                                       |
| - [system_template_suffix](#prompts_additionalProperties_model_overrides_additionalProperties_system_template_suffix ) | No      | string | No         | -                                                               | Text appended to the system template for this model                                        |
| - [system_template](#prompts_additionalProperties_model_overrides_additionalProperties_system_template )               | No      | string | No         | -                                                               | Complete replacement system template for this model (overrides the base template entirely) |
| - [parameters](#prompts_additionalProperties_model_overrides_additionalProperties_parameters )                         | No      | object | No         | Same as [parameters](#prompts_additionalProperties_parameters ) | Model-specific parameter overrides                                                         |

###### <a name="prompts_additionalProperties_model_overrides_additionalProperties_system_template_prefix"></a>7.1.14.1.1. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template_prefix`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Text prepended to the system template for this model

**Examples:**

```json
"<thinking>\\n"
```

```json
"[Task]\\n"
```

###### <a name="prompts_additionalProperties_model_overrides_additionalProperties_system_template_suffix"></a>7.1.14.1.2. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template_suffix`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Text appended to the system template for this model

**Examples:**

```json
"\\n\\nBe concise and direct."
```

```json
"\\n</thinking>"
```

###### <a name="prompts_additionalProperties_model_overrides_additionalProperties_system_template"></a>7.1.14.1.3. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > system_template`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Complete replacement system template for this model (overrides the base template entirely)

###### <a name="prompts_additionalProperties_model_overrides_additionalProperties_parameters"></a>7.1.14.1.4. Property `PromptPack Specification > prompts > additionalProperties > model_overrides > additionalProperties > parameters`

|                           |                                                        |
| ------------------------- | ------------------------------------------------------ |
| **Type**                  | `object`                                               |
| **Required**              | No                                                     |
| **Additional properties** | Not allowed                                            |
| **Same definition as**    | [parameters](#prompts_additionalProperties_parameters) |

**Description:** Model-specific parameter overrides

#### <a name="prompts_additionalProperties_media"></a>7.1.15. Property `PromptPack Specification > prompts > additionalProperties > media`

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/MediaConfig |

**Description:** Multimodal content configuration for this prompt. Defines supported media types and validation rules.

| Property                                                                  | Pattern | Type            | Deprecated | Definition                | Title/Description                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------- | ------- | --------------- | ---------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| + [enabled](#prompts_additionalProperties_media_enabled )                 | No      | boolean         | No         | -                         | Whether multimodal content is enabled for this prompt                                                                                                                                                                                                                                                   |
| - [supported_types](#prompts_additionalProperties_media_supported_types ) | No      | array of string | No         | -                         | List of supported media types for this prompt. Common types include: image, audio, video, document, model3d, archive. Custom types are allowed - each type should have a corresponding configuration object (e.g., 'foo' type requires a 'foo' field with GenericMediaTypeConfig or a specific schema). |
| - [image](#prompts_additionalProperties_media_image )                     | No      | object          | No         | In #/$defs/ImageConfig    | Image-specific configuration and constraints                                                                                                                                                                                                                                                            |
| - [audio](#prompts_additionalProperties_media_audio )                     | No      | object          | No         | In #/$defs/AudioConfig    | Audio-specific configuration and constraints                                                                                                                                                                                                                                                            |
| - [video](#prompts_additionalProperties_media_video )                     | No      | object          | No         | In #/$defs/VideoConfig    | Video-specific configuration and constraints                                                                                                                                                                                                                                                            |
| - [document](#prompts_additionalProperties_media_document )               | No      | object          | No         | In #/$defs/DocumentConfig | Document-specific configuration and constraints (PDFs, CAD files, spreadsheets, etc.)                                                                                                                                                                                                                   |
| - [examples](#prompts_additionalProperties_media_examples )               | No      | array           | No         | -                         | Example multimodal messages showing how to use media with this prompt                                                                                                                                                                                                                                   |
| - [^[a-z0-9_]+$](#prompts_additionalProperties_media_pattern1 )           | Yes     | Combination     | No         | -                         | -                                                                                                                                                                                                                                                                                                       |

##### <a name="prompts_additionalProperties_media_enabled"></a>7.1.15.1. Property `PromptPack Specification > prompts > additionalProperties > media > enabled`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | Yes       |

**Description:** Whether multimodal content is enabled for this prompt

##### <a name="prompts_additionalProperties_media_supported_types"></a>7.1.15.2. Property `PromptPack Specification > prompts > additionalProperties > media > supported_types`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of supported media types for this prompt. Common types include: image, audio, video, document, model3d, archive. Custom types are allowed - each type should have a corresponding configuration object (e.g., 'foo' type requires a 'foo' field with GenericMediaTypeConfig or a specific schema).

**Examples:**

```json
[
    "image"
]
```

```json
[
    "image",
    "audio"
]
```

```json
[
    "image",
    "audio",
    "video"
]
```

```json
[
    "document",
    "image"
]
```

```json
[
    "model3d",
    "document"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                    | Description |
| ---------------------------------------------------------------------------------- | ----------- |
| [supported_types items](#prompts_additionalProperties_media_supported_types_items) | -           |

###### <a name="prompts_additionalProperties_media_supported_types_items"></a>7.1.15.2.1. PromptPack Specification > prompts > additionalProperties > media > supported_types > supported_types items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

| Restrictions                      |                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-z0-9_]+$``` [Test](https://regex101.com/?regex=%5E%5Ba-z0-9_%5D%2B%24) |

##### <a name="prompts_additionalProperties_media_image"></a>7.1.15.3. Property `PromptPack Specification > prompts > additionalProperties > media > image`

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/ImageConfig |

**Description:** Image-specific configuration and constraints

| Property                                                                              | Pattern | Type                      | Deprecated | Definition | Title/Description                                                                                                              |
| ------------------------------------------------------------------------------------- | ------- | ------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| - [max_size_mb](#prompts_additionalProperties_media_image_max_size_mb )               | No      | integer                   | No         | -          | Maximum file size in megabytes                                                                                                 |
| - [allowed_formats](#prompts_additionalProperties_media_image_allowed_formats )       | No      | array of enum (of string) | No         | -          | List of allowed image formats                                                                                                  |
| - [default_detail](#prompts_additionalProperties_media_image_default_detail )         | No      | enum (of string)          | No         | -          | Default detail level for image processing. 'low' uses fewer tokens, 'high' provides more detail, 'auto' lets the model decide. |
| - [require_caption](#prompts_additionalProperties_media_image_require_caption )       | No      | boolean                   | No         | -          | Whether image captions are required                                                                                            |
| - [max_images_per_msg](#prompts_additionalProperties_media_image_max_images_per_msg ) | No      | integer                   | No         | -          | Maximum number of images allowed per message                                                                                   |

###### <a name="prompts_additionalProperties_media_image_max_size_mb"></a>7.1.15.3.1. Property `PromptPack Specification > prompts > additionalProperties > media > image > max_size_mb`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum file size in megabytes

**Examples:**

```json
10
```

```json
20
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_image_allowed_formats"></a>7.1.15.3.2. Property `PromptPack Specification > prompts > additionalProperties > media > image > allowed_formats`

|              |                             |
| ------------ | --------------------------- |
| **Type**     | `array of enum (of string)` |
| **Required** | No                          |

**Description:** List of allowed image formats

**Example:**

```json
[
    "jpeg",
    "png",
    "webp"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                          | Description |
| ---------------------------------------------------------------------------------------- | ----------- |
| [allowed_formats items](#prompts_additionalProperties_media_image_allowed_formats_items) | -           |

###### <a name="prompts_additionalProperties_media_image_allowed_formats_items"></a>7.1.15.3.2.1. PromptPack Specification > prompts > additionalProperties > media > image > allowed_formats > allowed_formats items

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

Must be one of:
* "jpeg"
* "jpg"
* "png"
* "webp"
* "gif"
* "bmp"

###### <a name="prompts_additionalProperties_media_image_default_detail"></a>7.1.15.3.3. Property `PromptPack Specification > prompts > additionalProperties > media > image > default_detail`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |
| **Default**  | `"auto"`           |

**Description:** Default detail level for image processing. 'low' uses fewer tokens, 'high' provides more detail, 'auto' lets the model decide.

**Examples:**

```json
"high"
```

```json
"auto"
```

Must be one of:
* "low"
* "high"
* "auto"

###### <a name="prompts_additionalProperties_media_image_require_caption"></a>7.1.15.3.4. Property `PromptPack Specification > prompts > additionalProperties > media > image > require_caption`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** Whether image captions are required

###### <a name="prompts_additionalProperties_media_image_max_images_per_msg"></a>7.1.15.3.5. Property `PromptPack Specification > prompts > additionalProperties > media > image > max_images_per_msg`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum number of images allowed per message

**Examples:**

```json
1
```

```json
5
```

```json
10
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

##### <a name="prompts_additionalProperties_media_audio"></a>7.1.15.4. Property `PromptPack Specification > prompts > additionalProperties > media > audio`

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/AudioConfig |

**Description:** Audio-specific configuration and constraints

| Property                                                                          | Pattern | Type                      | Deprecated | Definition | Title/Description                                       |
| --------------------------------------------------------------------------------- | ------- | ------------------------- | ---------- | ---------- | ------------------------------------------------------- |
| - [max_size_mb](#prompts_additionalProperties_media_audio_max_size_mb )           | No      | integer                   | No         | -          | Maximum file size in megabytes                          |
| - [allowed_formats](#prompts_additionalProperties_media_audio_allowed_formats )   | No      | array of enum (of string) | No         | -          | List of allowed audio formats                           |
| - [max_duration_sec](#prompts_additionalProperties_media_audio_max_duration_sec ) | No      | integer                   | No         | -          | Maximum audio duration in seconds                       |
| - [require_metadata](#prompts_additionalProperties_media_audio_require_metadata ) | No      | boolean                   | No         | -          | Whether audio metadata (title, description) is required |

###### <a name="prompts_additionalProperties_media_audio_max_size_mb"></a>7.1.15.4.1. Property `PromptPack Specification > prompts > additionalProperties > media > audio > max_size_mb`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum file size in megabytes

**Examples:**

```json
25
```

```json
50
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_audio_allowed_formats"></a>7.1.15.4.2. Property `PromptPack Specification > prompts > additionalProperties > media > audio > allowed_formats`

|              |                             |
| ------------ | --------------------------- |
| **Type**     | `array of enum (of string)` |
| **Required** | No                          |

**Description:** List of allowed audio formats

**Example:**

```json
[
    "mp3",
    "wav",
    "opus"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                          | Description |
| ---------------------------------------------------------------------------------------- | ----------- |
| [allowed_formats items](#prompts_additionalProperties_media_audio_allowed_formats_items) | -           |

###### <a name="prompts_additionalProperties_media_audio_allowed_formats_items"></a>7.1.15.4.2.1. PromptPack Specification > prompts > additionalProperties > media > audio > allowed_formats > allowed_formats items

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

Must be one of:
* "mp3"
* "wav"
* "opus"
* "flac"
* "m4a"
* "aac"

###### <a name="prompts_additionalProperties_media_audio_max_duration_sec"></a>7.1.15.4.3. Property `PromptPack Specification > prompts > additionalProperties > media > audio > max_duration_sec`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum audio duration in seconds

**Examples:**

```json
300
```

```json
600
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_audio_require_metadata"></a>7.1.15.4.4. Property `PromptPack Specification > prompts > additionalProperties > media > audio > require_metadata`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** Whether audio metadata (title, description) is required

##### <a name="prompts_additionalProperties_media_video"></a>7.1.15.5. Property `PromptPack Specification > prompts > additionalProperties > media > video`

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/VideoConfig |

**Description:** Video-specific configuration and constraints

| Property                                                                          | Pattern | Type                      | Deprecated | Definition | Title/Description                                       |
| --------------------------------------------------------------------------------- | ------- | ------------------------- | ---------- | ---------- | ------------------------------------------------------- |
| - [max_size_mb](#prompts_additionalProperties_media_video_max_size_mb )           | No      | integer                   | No         | -          | Maximum file size in megabytes                          |
| - [allowed_formats](#prompts_additionalProperties_media_video_allowed_formats )   | No      | array of enum (of string) | No         | -          | List of allowed video formats                           |
| - [max_duration_sec](#prompts_additionalProperties_media_video_max_duration_sec ) | No      | integer                   | No         | -          | Maximum video duration in seconds                       |
| - [require_metadata](#prompts_additionalProperties_media_video_require_metadata ) | No      | boolean                   | No         | -          | Whether video metadata (title, description) is required |

###### <a name="prompts_additionalProperties_media_video_max_size_mb"></a>7.1.15.5.1. Property `PromptPack Specification > prompts > additionalProperties > media > video > max_size_mb`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum file size in megabytes

**Examples:**

```json
100
```

```json
200
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_video_allowed_formats"></a>7.1.15.5.2. Property `PromptPack Specification > prompts > additionalProperties > media > video > allowed_formats`

|              |                             |
| ------------ | --------------------------- |
| **Type**     | `array of enum (of string)` |
| **Required** | No                          |

**Description:** List of allowed video formats

**Example:**

```json
[
    "mp4",
    "webm"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                          | Description |
| ---------------------------------------------------------------------------------------- | ----------- |
| [allowed_formats items](#prompts_additionalProperties_media_video_allowed_formats_items) | -           |

###### <a name="prompts_additionalProperties_media_video_allowed_formats_items"></a>7.1.15.5.2.1. PromptPack Specification > prompts > additionalProperties > media > video > allowed_formats > allowed_formats items

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

Must be one of:
* "mp4"
* "webm"
* "mov"
* "avi"
* "mkv"

###### <a name="prompts_additionalProperties_media_video_max_duration_sec"></a>7.1.15.5.3. Property `PromptPack Specification > prompts > additionalProperties > media > video > max_duration_sec`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum video duration in seconds

**Examples:**

```json
600
```

```json
1200
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_video_require_metadata"></a>7.1.15.5.4. Property `PromptPack Specification > prompts > additionalProperties > media > video > require_metadata`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** Whether video metadata (title, description) is required

##### <a name="prompts_additionalProperties_media_document"></a>7.1.15.6. Property `PromptPack Specification > prompts > additionalProperties > media > document`

|                           |                        |
| ------------------------- | ---------------------- |
| **Type**                  | `object`               |
| **Required**              | No                     |
| **Additional properties** | Not allowed            |
| **Defined in**            | #/$defs/DocumentConfig |

**Description:** Document-specific configuration and constraints (PDFs, CAD files, spreadsheets, etc.)

| Property                                                                             | Pattern | Type             | Deprecated | Definition | Title/Description                                                                                                                        |
| ------------------------------------------------------------------------------------ | ------- | ---------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| - [max_size_mb](#prompts_additionalProperties_media_document_max_size_mb )           | No      | integer          | No         | -          | Maximum file size in megabytes                                                                                                           |
| - [allowed_formats](#prompts_additionalProperties_media_document_allowed_formats )   | No      | array of string  | No         | -          | List of allowed document formats                                                                                                         |
| - [max_pages](#prompts_additionalProperties_media_document_max_pages )               | No      | integer          | No         | -          | Maximum number of pages/sheets for paginated documents                                                                                   |
| - [require_metadata](#prompts_additionalProperties_media_document_require_metadata ) | No      | boolean          | No         | -          | Whether document metadata (title, author, description) is required                                                                       |
| - [extraction_mode](#prompts_additionalProperties_media_document_extraction_mode )   | No      | enum (of string) | No         | -          | How to extract content from documents. 'text' extracts text only, 'structured' preserves formatting, 'raw' keeps original binary format. |

###### <a name="prompts_additionalProperties_media_document_max_size_mb"></a>7.1.15.6.1. Property `PromptPack Specification > prompts > additionalProperties > media > document > max_size_mb`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum file size in megabytes

**Examples:**

```json
50
```

```json
100
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_document_allowed_formats"></a>7.1.15.6.2. Property `PromptPack Specification > prompts > additionalProperties > media > document > allowed_formats`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of allowed document formats

**Examples:**

```json
[
    "pdf",
    "docx"
]
```

```json
[
    "pdf",
    "step",
    "dwg"
]
```

```json
[
    "csv",
    "xlsx",
    "ods"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                             | Description |
| ------------------------------------------------------------------------------------------- | ----------- |
| [allowed_formats items](#prompts_additionalProperties_media_document_allowed_formats_items) | -           |

###### <a name="prompts_additionalProperties_media_document_allowed_formats_items"></a>7.1.15.6.2.1. PromptPack Specification > prompts > additionalProperties > media > document > allowed_formats > allowed_formats items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

###### <a name="prompts_additionalProperties_media_document_max_pages"></a>7.1.15.6.3. Property `PromptPack Specification > prompts > additionalProperties > media > document > max_pages`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum number of pages/sheets for paginated documents

**Examples:**

```json
50
```

```json
100
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_document_require_metadata"></a>7.1.15.6.4. Property `PromptPack Specification > prompts > additionalProperties > media > document > require_metadata`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** Whether document metadata (title, author, description) is required

###### <a name="prompts_additionalProperties_media_document_extraction_mode"></a>7.1.15.6.5. Property `PromptPack Specification > prompts > additionalProperties > media > document > extraction_mode`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |
| **Default**  | `"text"`           |

**Description:** How to extract content from documents. 'text' extracts text only, 'structured' preserves formatting, 'raw' keeps original binary format.

**Examples:**

```json
"text"
```

```json
"structured"
```

Must be one of:
* "text"
* "structured"
* "raw"

##### <a name="prompts_additionalProperties_media_examples"></a>7.1.15.7. Property `PromptPack Specification > prompts > additionalProperties > media > examples`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Example multimodal messages showing how to use media with this prompt

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                         | Description                                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [MultimodalExample](#prompts_additionalProperties_media_examples_items) | Example multimodal message demonstrating how to use media content with a prompt |

###### <a name="prompts_additionalProperties_media_examples_items"></a>7.1.15.7.1. PromptPack Specification > prompts > additionalProperties > media > examples > MultimodalExample

|                           |                           |
| ------------------------- | ------------------------- |
| **Type**                  | `object`                  |
| **Required**              | No                        |
| **Additional properties** | Not allowed               |
| **Defined in**            | #/$defs/MultimodalExample |

**Description:** Example multimodal message demonstrating how to use media content with a prompt

| Property                                                                         | Pattern | Type             | Deprecated | Definition | Title/Description                              |
| -------------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------------------------------- |
| + [name](#prompts_additionalProperties_media_examples_items_name )               | No      | string           | No         | -          | Name identifying this example                  |
| - [description](#prompts_additionalProperties_media_examples_items_description ) | No      | string           | No         | -          | Description of what this example demonstrates  |
| + [role](#prompts_additionalProperties_media_examples_items_role )               | No      | enum (of string) | No         | -          | Message role (typically 'user' or 'assistant') |
| + [parts](#prompts_additionalProperties_media_examples_items_parts )             | No      | array            | No         | -          | Message content parts (text and/or media)      |

###### <a name="prompts_additionalProperties_media_examples_items_name"></a>7.1.15.7.1.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Name identifying this example

**Examples:**

```json
"image-analysis"
```

```json
"audio-transcription"
```

###### <a name="prompts_additionalProperties_media_examples_items_description"></a>7.1.15.7.1.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Description of what this example demonstrates

###### <a name="prompts_additionalProperties_media_examples_items_role"></a>7.1.15.7.1.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > role`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** Message role (typically 'user' or 'assistant')

**Example:**

```json
"user"
```

Must be one of:
* "user"
* "assistant"
* "system"

###### <a name="prompts_additionalProperties_media_examples_items_parts"></a>7.1.15.7.1.4. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | Yes     |

**Description:** Message content parts (text and/or media)

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | 1                  |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                               | Description                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [ContentPart](#prompts_additionalProperties_media_examples_items_parts_items) | A single content part within a multimodal message. Can be text or media. |

###### <a name="prompts_additionalProperties_media_examples_items_parts_items"></a>7.1.15.7.1.4.1. PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > ContentPart

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/ContentPart |

**Description:** A single content part within a multimodal message. Can be text or media.

| Property                                                                         | Pattern | Type   | Deprecated | Definition                | Title/Description                                                                                                            |
| -------------------------------------------------------------------------------- | ------- | ------ | ---------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| + [type](#prompts_additionalProperties_media_examples_items_parts_items_type )   | No      | string | No         | -                         | Type of content part. Common types include: text, image, audio, video, document. Custom types are allowed for extensibility. |
| - [text](#prompts_additionalProperties_media_examples_items_parts_items_text )   | No      | string | No         | -                         | Text content (required when type is 'text')                                                                                  |
| - [media](#prompts_additionalProperties_media_examples_items_parts_items_media ) | No      | object | No         | In #/$defs/MediaReference | Media reference (required when type is 'image', 'audio', or 'video')                                                         |

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_type"></a>7.1.15.7.1.4.1.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > type`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Type of content part. Common types include: text, image, audio, video, document. Custom types are allowed for extensibility.

**Examples:**

```json
"text"
```

```json
"image"
```

```json
"audio"
```

```json
"document"
```

| Restrictions                      |                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-z0-9_]+$``` [Test](https://regex101.com/?regex=%5E%5Ba-z0-9_%5D%2B%24&testString=%22text%22) |

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_text"></a>7.1.15.7.1.4.1.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > text`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Text content (required when type is 'text')

**Examples:**

```json
"What's in this image?"
```

```json
"Describe the scene"
```

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media"></a>7.1.15.7.1.4.1.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media`

|                           |                        |
| ------------------------- | ---------------------- |
| **Type**                  | `object`               |
| **Required**              | No                     |
| **Additional properties** | Not allowed            |
| **Defined in**            | #/$defs/MediaReference |

**Description:** Media reference (required when type is 'image', 'audio', or 'video')

| Property                                                                                       | Pattern | Type             | Deprecated | Definition | Title/Description                                                                           |
| ---------------------------------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| - [file_path](#prompts_additionalProperties_media_examples_items_parts_items_media_file_path ) | No      | string           | No         | -          | Path to media file (relative to pack or absolute). Validated at compile time.               |
| - [url](#prompts_additionalProperties_media_examples_items_parts_items_media_url )             | No      | string           | No         | -          | URL to media file. Must be publicly accessible or require authentication.                   |
| - [base64](#prompts_additionalProperties_media_examples_items_parts_items_media_base64 )       | No      | string           | No         | -          | Base64-encoded media data. Use for small files or when embedding is preferred.              |
| + [mime_type](#prompts_additionalProperties_media_examples_items_parts_items_media_mime_type ) | No      | string           | No         | -          | MIME type of the media file                                                                 |
| - [detail](#prompts_additionalProperties_media_examples_items_parts_items_media_detail )       | No      | enum (of string) | No         | -          | Detail level for image processing (images only). Overrides default_detail from ImageConfig. |
| - [caption](#prompts_additionalProperties_media_examples_items_parts_items_media_caption )     | No      | string           | No         | -          | Caption or description for the media                                                        |

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_file_path"></a>7.1.15.7.1.4.1.3.1. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > file_path`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Path to media file (relative to pack or absolute). Validated at compile time.

**Examples:**

```json
"images/photo.jpg"
```

```json
"./media/audio.mp3"
```

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_url"></a>7.1.15.7.1.4.1.3.2. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > url`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |
| **Format**   | `uri`    |

**Description:** URL to media file. Must be publicly accessible or require authentication.

**Examples:**

```json
"https://example.com/image.jpg"
```

```json
"https://cdn.example.com/video.mp4"
```

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_base64"></a>7.1.15.7.1.4.1.3.3. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > base64`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Base64-encoded media data. Use for small files or when embedding is preferred.

**Example:**

```json
"iVBORw0KGgoAAAANSUhEUgAAAAUA..."
```

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_mime_type"></a>7.1.15.7.1.4.1.3.4. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > mime_type`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** MIME type of the media file

**Examples:**

```json
"image/jpeg"
```

```json
"image/png"
```

```json
"audio/mp3"
```

```json
"video/mp4"
```

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_detail"></a>7.1.15.7.1.4.1.3.5. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > detail`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

**Description:** Detail level for image processing (images only). Overrides default_detail from ImageConfig.

**Example:**

```json
"high"
```

Must be one of:
* "low"
* "high"
* "auto"

###### <a name="prompts_additionalProperties_media_examples_items_parts_items_media_caption"></a>7.1.15.7.1.4.1.3.6. Property `PromptPack Specification > prompts > additionalProperties > media > examples > examples items > parts > parts items > media > caption`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Caption or description for the media

**Examples:**

```json
"Product photo"
```

```json
"Customer's voice recording"
```

##### <a name="prompts_additionalProperties_media_pattern1"></a>7.1.15.8. Pattern Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$`
> All properties whose name matches the regular expression
```^[a-z0-9_]+$``` ([Test](https://regex101.com/?regex=%5E%5Ba-z0-9_%5D%2B%24))
must respect the following conditions

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `combining`      |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

| One of(Option)                                                                     |
| ---------------------------------------------------------------------------------- |
| [ImageConfig](#prompts_additionalProperties_media_pattern1_pattern1_i0)            |
| [AudioConfig](#prompts_additionalProperties_media_pattern1_pattern1_i1)            |
| [VideoConfig](#prompts_additionalProperties_media_pattern1_pattern1_i2)            |
| [DocumentConfig](#prompts_additionalProperties_media_pattern1_pattern1_i3)         |
| [GenericMediaTypeConfig](#prompts_additionalProperties_media_pattern1_pattern1_i4) |

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i0"></a>7.1.15.8.1. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > ImageConfig`

|                           |                                                    |
| ------------------------- | -------------------------------------------------- |
| **Type**                  | `object`                                           |
| **Required**              | No                                                 |
| **Additional properties** | Not allowed                                        |
| **Same definition as**    | [image](#prompts_additionalProperties_media_image) |

**Description:** Configuration and validation rules for image content

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i1"></a>7.1.15.8.2. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > AudioConfig`

|                           |                                                    |
| ------------------------- | -------------------------------------------------- |
| **Type**                  | `object`                                           |
| **Required**              | No                                                 |
| **Additional properties** | Not allowed                                        |
| **Same definition as**    | [audio](#prompts_additionalProperties_media_audio) |

**Description:** Configuration and validation rules for audio content

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i2"></a>7.1.15.8.3. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > VideoConfig`

|                           |                                                    |
| ------------------------- | -------------------------------------------------- |
| **Type**                  | `object`                                           |
| **Required**              | No                                                 |
| **Additional properties** | Not allowed                                        |
| **Same definition as**    | [video](#prompts_additionalProperties_media_video) |

**Description:** Configuration and validation rules for video content

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i3"></a>7.1.15.8.4. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > DocumentConfig`

|                           |                                                          |
| ------------------------- | -------------------------------------------------------- |
| **Type**                  | `object`                                                 |
| **Required**              | No                                                       |
| **Additional properties** | Not allowed                                              |
| **Same definition as**    | [document](#prompts_additionalProperties_media_document) |

**Description:** Configuration and validation rules for document content (PDFs, CAD files, spreadsheets, etc.)

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4"></a>7.1.15.8.5. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > GenericMediaTypeConfig`

|                           |                                |
| ------------------------- | ------------------------------ |
| **Type**                  | `object`                       |
| **Required**              | No                             |
| **Additional properties** | Any type allowed               |
| **Defined in**            | #/$defs/GenericMediaTypeConfig |

**Description:** Generic configuration for custom media types. Use this for types not covered by specific configs (ImageConfig, AudioConfig, etc.). Provides common validation properties that apply to most media types.

| Property                                                                                           | Pattern | Type            | Deprecated | Definition | Title/Description                                                                        |
| -------------------------------------------------------------------------------------------------- | ------- | --------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------- |
| - [max_size_mb](#prompts_additionalProperties_media_pattern1_pattern1_i4_max_size_mb )             | No      | integer         | No         | -          | Maximum file size in megabytes                                                           |
| - [allowed_formats](#prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats )     | No      | array of string | No         | -          | List of allowed file formats/extensions                                                  |
| - [require_metadata](#prompts_additionalProperties_media_pattern1_pattern1_i4_require_metadata )   | No      | boolean         | No         | -          | Whether metadata is required for this media type                                         |
| - [validation_params](#prompts_additionalProperties_media_pattern1_pattern1_i4_validation_params ) | No      | object          | No         | -          | Custom validation parameters specific to this media type. Structure depends on the type. |
| - - additionalProperties               | No      | object          | No         | -          | -                                                                                        |

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4_max_size_mb"></a>7.1.15.8.5.1. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > max_size_mb`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | No        |

**Description:** Maximum file size in megabytes

**Examples:**

```json
10
```

```json
50
```

```json
100
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats"></a>7.1.15.8.5.2. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > allowed_formats`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of allowed file formats/extensions

**Examples:**

```json
[
    "obj",
    "fbx",
    "gltf"
]
```

```json
[
    "zip",
    "tar"
]
```

```json
[
    "stl",
    "ply"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                                                         | Description |
| ------------------------------------------------------------------------------------------------------- | ----------- |
| [allowed_formats items](#prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats_items) | -           |

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4_allowed_formats_items"></a>7.1.15.8.5.2.1. PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > allowed_formats > allowed_formats items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4_require_metadata"></a>7.1.15.8.5.3. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > require_metadata`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** Whether metadata is required for this media type

###### <a name="prompts_additionalProperties_media_pattern1_pattern1_i4_validation_params"></a>7.1.15.8.5.4. Property `PromptPack Specification > prompts > additionalProperties > media > ^[a-z0-9_]+$ > oneOf > item 4 > validation_params`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Custom validation parameters specific to this media type. Structure depends on the type.

**Examples:**

```json
{
    "max_vertices": 100000,
    "require_textures": false
}
```

```json
{
    "compression": "gzip",
    "max_entries": 1000
}
```

| Property                                                                                               | Pattern | Type   | Deprecated | Definition | Title/Description |
| ------------------------------------------------------------------------------------------------------ | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

## <a name="fragments"></a>8. Property `PromptPack Specification > fragments`

|                           |                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                               |
| **Required**              | No                                                                                     |
| **Additional properties** | [Each additional property must conform to the schema](#fragments_additionalProperties) |

**Description:** Shared template fragments that can be referenced by any prompt in the pack. Fragments are reusable text blocks resolved at compile time. Keys are fragment names, values are fragment content.

**Example:**

```json
{
    "customer_context": "Customer: `{{customer_name}}`\\nIssue: `{{issue}}`",
    "greeting": "Hello! How can I help you today?"
}
```

| Property                               | Pattern | Type   | Deprecated | Definition | Title/Description |
| -------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | string | No         | -          | -                 |

### <a name="fragments_additionalProperties"></a>8.1. Property `PromptPack Specification > fragments > additionalProperties`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

## <a name="tools"></a>9. Property `PromptPack Specification > tools`

|                           |                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                           |
| **Required**              | No                                                                                 |
| **Additional properties** | [Each additional property must conform to the schema](#tools_additionalProperties) |

**Description:** Tool definitions that can be referenced by prompts. Tools enable the LLM to call external functions. Keys are tool names, values are tool specifications following the JSON Schema for function calling.

| Property                           | Pattern | Type   | Deprecated | Definition      | Title/Description                                                                                                                                  |
| ---------------------------------- | ------- | ------ | ---------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| - - additionalProperties | No      | object | No         | In #/$defs/Tool | A tool definition following OpenAI's function calling format. Tools enable the LLM to call external functions to retrieve data or perform actions. |

### <a name="tools_additionalProperties"></a>9.1. Property `PromptPack Specification > tools > Tool`

|                           |              |
| ------------------------- | ------------ |
| **Type**                  | `object`     |
| **Required**              | No           |
| **Additional properties** | Not allowed  |
| **Defined in**            | #/$defs/Tool |

**Description:** A tool definition following OpenAI's function calling format. Tools enable the LLM to call external functions to retrieve data or perform actions.

| Property                                                  | Pattern | Type   | Deprecated | Definition | Title/Description                                                                           |
| --------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| + [name](#tools_additionalProperties_name )               | No      | string | No         | -          | Tool name used for referencing and calling                                                  |
| + [description](#tools_additionalProperties_description ) | No      | string | No         | -          | Clear description of what the tool does. The LLM uses this to decide when to call the tool. |
| - [parameters](#tools_additionalProperties_parameters )   | No      | object | No         | -          | JSON Schema defining the tool's parameters. Follows JSON Schema specification.              |

#### <a name="tools_additionalProperties_name"></a>9.1.1. Property `PromptPack Specification > tools > additionalProperties > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Tool name used for referencing and calling

**Examples:**

```json
"lookup_order"
```

```json
"create_ticket"
```

```json
"search_database"
```

| Restrictions                      |                                                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-zA-Z_][a-zA-Z0-9_]*$``` [Test](https://regex101.com/?regex=%5E%5Ba-zA-Z_%5D%5Ba-zA-Z0-9_%5D%2A%24&testString=%22lookup_order%22) |

#### <a name="tools_additionalProperties_description"></a>9.1.2. Property `PromptPack Specification > tools > additionalProperties > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Clear description of what the tool does. The LLM uses this to decide when to call the tool.

**Examples:**

```json
"Look up order details by order ID"
```

```json
"Create a support ticket with title, description, and priority"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

#### <a name="tools_additionalProperties_parameters"></a>9.1.3. Property `PromptPack Specification > tools > additionalProperties > parameters`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** JSON Schema defining the tool's parameters. Follows JSON Schema specification.

| Property                                                           | Pattern | Type             | Deprecated | Definition | Title/Description                    |
| ------------------------------------------------------------------ | ------- | ---------------- | ---------- | ---------- | ------------------------------------ |
| + [type](#tools_additionalProperties_parameters_type )             | No      | enum (of string) | No         | -          | Must be 'object' for tool parameters |
| + [properties](#tools_additionalProperties_parameters_properties ) | No      | object           | No         | -          | Parameter definitions                |
| - [required](#tools_additionalProperties_parameters_required )     | No      | array of string  | No         | -          | List of required parameter names     |

##### <a name="tools_additionalProperties_parameters_type"></a>9.1.3.1. Property `PromptPack Specification > tools > additionalProperties > parameters > type`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | Yes                |

**Description:** Must be 'object' for tool parameters

Must be one of:
* "object"

##### <a name="tools_additionalProperties_parameters_properties"></a>9.1.3.2. Property `PromptPack Specification > tools > additionalProperties > parameters > properties`

|                           |                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                                                                      |
| **Required**              | Yes                                                                                                                           |
| **Additional properties** | [Each additional property must conform to the schema](#tools_additionalProperties_parameters_properties_additionalProperties) |

**Description:** Parameter definitions

| Property                                                                      | Pattern | Type   | Deprecated | Definition | Title/Description |
| ----------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

###### <a name="tools_additionalProperties_parameters_properties_additionalProperties"></a>9.1.3.2.1. Property `PromptPack Specification > tools > additionalProperties > parameters > properties > additionalProperties`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

##### <a name="tools_additionalProperties_parameters_required"></a>9.1.3.3. Property `PromptPack Specification > tools > additionalProperties > parameters > required`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** List of required parameter names

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                         | Description |
| ----------------------------------------------------------------------- | ----------- |
| [required items](#tools_additionalProperties_parameters_required_items) | -           |

###### <a name="tools_additionalProperties_parameters_required_items"></a>9.1.3.3.1. PromptPack Specification > tools > additionalProperties > parameters > required > required items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

## <a name="metadata"></a>10. Property `PromptPack Specification > metadata`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Optional pack-level metadata for categorization, discovery, and operational planning.

| Property                                    | Pattern | Type            | Deprecated | Definition | Title/Description                     |
| ------------------------------------------- | ------- | --------------- | ---------- | ---------- | ------------------------------------- |
| - [domain](#metadata_domain )               | No      | string          | No         | -          | Domain or category for this pack      |
| - [language](#metadata_language )           | No      | string          | No         | -          | Primary language code (ISO 639-1)     |
| - [tags](#metadata_tags )                   | No      | array of string | No         | -          | Tags for categorization and discovery |
| - [cost_estimate](#metadata_cost_estimate ) | No      | object          | No         | -          | Cost estimation for using this pack   |
| - - additionalProperties       | No      | object          | No         | -          | -                                     |

### <a name="metadata_domain"></a>10.1. Property `PromptPack Specification > metadata > domain`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Domain or category for this pack

**Examples:**

```json
"customer-service"
```

```json
"healthcare"
```

```json
"finance"
```

### <a name="metadata_language"></a>10.2. Property `PromptPack Specification > metadata > language`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Primary language code (ISO 639-1)

**Examples:**

```json
"en"
```

```json
"es"
```

```json
"fr"
```

| Restrictions                      |                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Must match regular expression** | ```^[a-z]{2}$``` [Test](https://regex101.com/?regex=%5E%5Ba-z%5D%7B2%7D%24&testString=%22en%22) |

### <a name="metadata_tags"></a>10.3. Property `PromptPack Specification > metadata > tags`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** Tags for categorization and discovery

**Example:**

```json
[
    "support",
    "sales",
    "technical"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be    | Description |
| ---------------------------------- | ----------- |
| [tags items](#metadata_tags_items) | -           |

#### <a name="metadata_tags_items"></a>10.3.1. PromptPack Specification > metadata > tags > tags items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

### <a name="metadata_cost_estimate"></a>10.4. Property `PromptPack Specification > metadata > cost_estimate`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Cost estimation for using this pack

| Property                                                | Pattern | Type   | Deprecated | Definition | Title/Description                 |
| ------------------------------------------------------- | ------- | ------ | ---------- | ---------- | --------------------------------- |
| - [min_cost_usd](#metadata_cost_estimate_min_cost_usd ) | No      | number | No         | -          | Minimum cost per execution in USD |
| - [max_cost_usd](#metadata_cost_estimate_max_cost_usd ) | No      | number | No         | -          | Maximum cost per execution in USD |
| - [avg_cost_usd](#metadata_cost_estimate_avg_cost_usd ) | No      | number | No         | -          | Average cost per execution in USD |

#### <a name="metadata_cost_estimate_min_cost_usd"></a>10.4.1. Property `PromptPack Specification > metadata > cost_estimate > min_cost_usd`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Minimum cost per execution in USD

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

#### <a name="metadata_cost_estimate_max_cost_usd"></a>10.4.2. Property `PromptPack Specification > metadata > cost_estimate > max_cost_usd`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Maximum cost per execution in USD

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

#### <a name="metadata_cost_estimate_avg_cost_usd"></a>10.4.3. Property `PromptPack Specification > metadata > cost_estimate > avg_cost_usd`

|              |          |
| ------------ | -------- |
| **Type**     | `number` |
| **Required** | No       |

**Description:** Average cost per execution in USD

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 0 |

## <a name="compilation"></a>11. Property `PromptPack Specification > compilation`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Information about when and how this pack was compiled. Generated automatically by the packc compiler.

| Property                                       | Pattern | Type   | Deprecated | Definition | Title/Description                                      |
| ---------------------------------------------- | ------- | ------ | ---------- | ---------- | ------------------------------------------------------ |
| + [compiled_with](#compilation_compiled_with ) | No      | string | No         | -          | Version of the packc compiler used to create this pack |
| + [created_at](#compilation_created_at )       | No      | string | No         | -          | ISO 8601 timestamp when the pack was compiled          |
| + [schema](#compilation_schema )               | No      | string | No         | -          | Pack format schema version used                        |
| - [source](#compilation_source )               | No      | string | No         | -          | Optional source configuration file path                |

### <a name="compilation_compiled_with"></a>11.1. Property `PromptPack Specification > compilation > compiled_with`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Version of the packc compiler used to create this pack

**Examples:**

```json
"packc-v0.1.0"
```

```json
"packc-v1.2.3"
```

### <a name="compilation_created_at"></a>11.2. Property `PromptPack Specification > compilation > created_at`

|              |             |
| ------------ | ----------- |
| **Type**     | `string`    |
| **Required** | Yes         |
| **Format**   | `date-time` |

**Description:** ISO 8601 timestamp when the pack was compiled

**Example:**

```json
"2025-10-31T12:00:00Z"
```

### <a name="compilation_schema"></a>11.3. Property `PromptPack Specification > compilation > schema`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Pack format schema version used

**Examples:**

```json
"v1"
```

```json
"v2"
```

### <a name="compilation_source"></a>11.4. Property `PromptPack Specification > compilation > source`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Optional source configuration file path

**Examples:**

```json
"arena.yaml"
```

```json
"config/prompts.yaml"
```

## <a name="evals"></a>12. Property `PromptPack Specification > evals`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Pack-level eval definitions that apply across all prompts. Useful for cross-cutting quality concerns like brand consistency or safety checks. Prompt-level evals with the same id override pack-level evals.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be | Description                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Eval](#evals_items)            | An eval definition that declares how to assess LLM output quality. Evals run asynchronously and produce scores or metrics, unlike validators which run inline and block. |

### <a name="evals_items"></a>12.1. PromptPack Specification > evals > Eval

|                           |                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                              |
| **Required**              | No                                                                                    |
| **Additional properties** | Not allowed                                                                           |
| **Same definition as**    | [prompts_additionalProperties_evals_items](#prompts_additionalProperties_evals_items) |

**Description:** An eval definition that declares how to assess LLM output quality. Evals run asynchronously and produce scores or metrics, unlike validators which run inline and block.

## <a name="workflow"></a>13. Property `PromptPack Specification > workflow`

|                           |                        |
| ------------------------- | ---------------------- |
| **Type**                  | `object`               |
| **Required**              | No                     |
| **Additional properties** | Not allowed            |
| **Defined in**            | #/$defs/WorkflowConfig |

**Description:** Workflow configuration defining a state machine over the pack's prompts. Each state references a prompt key and declares event-driven transitions.

| Property                        | Pattern | Type    | Deprecated | Definition | Title/Description                                                                               |
| ------------------------------- | ------- | ------- | ---------- | ---------- | ----------------------------------------------------------------------------------------------- |
| + [version](#workflow_version ) | No      | integer | No         | -          | Workflow schema version. Use 1 for the current stable format.                                   |
| + [entry](#workflow_entry )     | No      | string  | No         | -          | Name of the initial state. Must match a key in the states object.                               |
| + [states](#workflow_states )   | No      | object  | No         | -          | Map of state name to state definition. Each state references a prompt and declares transitions. |
| - [engine](#workflow_engine )   | No      | object  | No         | -          | Optional runtime engine hints for workflow execution (e.g., timeout, concurrency settings).     |

### <a name="workflow_version"></a>13.1. Property `PromptPack Specification > workflow > version`

|              |           |
| ------------ | --------- |
| **Type**     | `integer` |
| **Required** | Yes       |

**Description:** Workflow schema version. Use 1 for the current stable format.

**Example:**

```json
1
```

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |

### <a name="workflow_entry"></a>13.2. Property `PromptPack Specification > workflow > entry`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Name of the initial state. Must match a key in the states object.

**Examples:**

```json
"greeting"
```

```json
"triage"
```

### <a name="workflow_states"></a>13.3. Property `PromptPack Specification > workflow > states`

|                           |                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                                     |
| **Required**              | Yes                                                                                          |
| **Additional properties** | [Each additional property must conform to the schema](#workflow_states_additionalProperties) |

**Description:** Map of state name to state definition. Each state references a prompt and declares transitions.

| Property                                     | Pattern | Type   | Deprecated | Definition               | Title/Description                                                                                                             |
| -------------------------------------------- | ------- | ------ | ---------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| - - additionalProperties | No      | object | No         | In #/$defs/WorkflowState | A single state in the workflow state machine. References a prompt task and declares event-driven transitions to other states. |

#### <a name="workflow_states_additionalProperties"></a>13.3.1. Property `PromptPack Specification > workflow > states > WorkflowState`

|                           |                       |
| ------------------------- | --------------------- |
| **Type**                  | `object`              |
| **Required**              | No                    |
| **Additional properties** | Not allowed           |
| **Defined in**            | #/$defs/WorkflowState |

**Description:** A single state in the workflow state machine. References a prompt task and declares event-driven transitions to other states.

| Property                                                                | Pattern | Type             | Deprecated | Definition | Title/Description                                                                                                                                                     |
| ----------------------------------------------------------------------- | ------- | ---------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| + [prompt_task](#workflow_states_additionalProperties_prompt_task )     | No      | string           | No         | -          | Reference to a prompt key defined in the pack's prompts object.                                                                                                       |
| - [description](#workflow_states_additionalProperties_description )     | No      | string           | No         | -          | Human-readable description of this state's purpose.                                                                                                                   |
| + [on_event](#workflow_states_additionalProperties_on_event )           | No      | object           | No         | -          | Map of event name to target state name. When the named event fires, the workflow transitions to the target state.                                                     |
| - [persistence](#workflow_states_additionalProperties_persistence )     | No      | enum (of string) | No         | -          | Whether conversation context is kept (persistent) or reset (transient) on entry.                                                                                      |
| - [orchestration](#workflow_states_additionalProperties_orchestration ) | No      | enum (of string) | No         | -          | How this state is orchestrated: internal (runtime manages), external (caller manages), or hybrid.                                                                     |
| - [skills](#workflow_states_additionalProperties_skills )               | No      | string           | No         | -          | Skill filter for this workflow state. A path to a skill directory/file that scopes which skills are available in this state, or the literal 'none' to disable skills. |

##### <a name="workflow_states_additionalProperties_prompt_task"></a>13.3.1.1. Property `PromptPack Specification > workflow > states > additionalProperties > prompt_task`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Reference to a prompt key defined in the pack's prompts object.

**Examples:**

```json
"support"
```

```json
"sales"
```

```json
"triage"
```

##### <a name="workflow_states_additionalProperties_description"></a>13.3.1.2. Property `PromptPack Specification > workflow > states > additionalProperties > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Human-readable description of this state's purpose.

##### <a name="workflow_states_additionalProperties_on_event"></a>13.3.1.3. Property `PromptPack Specification > workflow > states > additionalProperties > on_event`

|                           |                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                                                                   |
| **Required**              | Yes                                                                                                                        |
| **Additional properties** | [Each additional property must conform to the schema](#workflow_states_additionalProperties_on_event_additionalProperties) |

**Description:** Map of event name to target state name. When the named event fires, the workflow transitions to the target state.

**Example:**

```json
{
    "escalate": "human_handoff",
    "resolved": "closing"
}
```

| Property                                                                   | Pattern | Type   | Deprecated | Definition | Title/Description |
| -------------------------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | string | No         | -          | -                 |

###### <a name="workflow_states_additionalProperties_on_event_additionalProperties"></a>13.3.1.3.1. Property `PromptPack Specification > workflow > states > additionalProperties > on_event > additionalProperties`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

##### <a name="workflow_states_additionalProperties_persistence"></a>13.3.1.4. Property `PromptPack Specification > workflow > states > additionalProperties > persistence`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

**Description:** Whether conversation context is kept (persistent) or reset (transient) on entry.

Must be one of:
* "transient"
* "persistent"

##### <a name="workflow_states_additionalProperties_orchestration"></a>13.3.1.5. Property `PromptPack Specification > workflow > states > additionalProperties > orchestration`

|              |                    |
| ------------ | ------------------ |
| **Type**     | `enum (of string)` |
| **Required** | No                 |

**Description:** How this state is orchestrated: internal (runtime manages), external (caller manages), or hybrid.

Must be one of:
* "internal"
* "external"
* "hybrid"

##### <a name="workflow_states_additionalProperties_skills"></a>13.3.1.6. Property `PromptPack Specification > workflow > states > additionalProperties > skills`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Skill filter for this workflow state. A path to a skill directory/file that scopes which skills are available in this state, or the literal 'none' to disable skills.

**Examples:**

```json
"./skills/billing"
```

```json
"none"
```

### <a name="workflow_engine"></a>13.4. Property `PromptPack Specification > workflow > engine`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Any type allowed |

**Description:** Optional runtime engine hints for workflow execution (e.g., timeout, concurrency settings).

| Property                                     | Pattern | Type   | Deprecated | Definition | Title/Description |
| -------------------------------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| - - additionalProperties | No      | object | No         | -          | -                 |

## <a name="agents"></a>14. Property `PromptPack Specification > agents`

|                           |                      |
| ------------------------- | -------------------- |
| **Type**                  | `object`             |
| **Required**              | No                   |
| **Additional properties** | Not allowed          |
| **Defined in**            | #/$defs/AgentsConfig |

**Description:** Agent configuration mapping prompts to A2A-compatible agent definitions. Enables multi-agent orchestration via the Agent-to-Agent protocol.

| Property                      | Pattern | Type   | Deprecated | Definition | Title/Description                                                                                         |
| ----------------------------- | ------- | ------ | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| + [entry](#agents_entry )     | No      | string | No         | -          | Prompt key of the entry agent — the default agent that receives incoming requests.                        |
| + [members](#agents_members ) | No      | object | No         | -          | Map of prompt key to agent definition. Each key must match a prompt defined in the pack's prompts object. |

### <a name="agents_entry"></a>14.1. Property `PromptPack Specification > agents > entry`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Prompt key of the entry agent — the default agent that receives incoming requests.

**Examples:**

```json
"triage"
```

```json
"router"
```

```json
"main"
```

### <a name="agents_members"></a>14.2. Property `PromptPack Specification > agents > members`

|                           |                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| **Type**                  | `object`                                                                                    |
| **Required**              | Yes                                                                                         |
| **Additional properties** | [Each additional property must conform to the schema](#agents_members_additionalProperties) |

**Description:** Map of prompt key to agent definition. Each key must match a prompt defined in the pack's prompts object.

| Property                                    | Pattern | Type   | Deprecated | Definition          | Title/Description                                                                                                                            |
| ------------------------------------------- | ------- | ------ | ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| - - additionalProperties | No      | object | No         | In #/$defs/AgentDef | Agent definition for a single prompt, providing A2A Agent Card metadata. Overrides or extends the prompt's own metadata for agent discovery. |

#### <a name="agents_members_additionalProperties"></a>14.2.1. Property `PromptPack Specification > agents > members > AgentDef`

|                           |                  |
| ------------------------- | ---------------- |
| **Type**                  | `object`         |
| **Required**              | No               |
| **Additional properties** | Not allowed      |
| **Defined in**            | #/$defs/AgentDef |

**Description:** Agent definition for a single prompt, providing A2A Agent Card metadata. Overrides or extends the prompt's own metadata for agent discovery.

| Property                                                             | Pattern | Type            | Deprecated | Definition | Title/Description                                                                             |
| -------------------------------------------------------------------- | ------- | --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------- |
| - [description](#agents_members_additionalProperties_description )   | No      | string          | No         | -          | Agent description published in the A2A Agent Card. Overrides the prompt's description if set. |
| - [tags](#agents_members_additionalProperties_tags )                 | No      | array of string | No         | -          | Discovery tags for the agent, used by A2A registries and routers.                             |
| - [input_modes](#agents_members_additionalProperties_input_modes )   | No      | array of string | No         | -          | MIME types the agent accepts as input. Defaults to ["text/plain"] if omitted.                 |
| - [output_modes](#agents_members_additionalProperties_output_modes ) | No      | array of string | No         | -          | MIME types the agent can produce as output. Defaults to ["text/plain"] if omitted.            |

##### <a name="agents_members_additionalProperties_description"></a>14.2.1.1. Property `PromptPack Specification > agents > members > additionalProperties > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Agent description published in the A2A Agent Card. Overrides the prompt's description if set.

##### <a name="agents_members_additionalProperties_tags"></a>14.2.1.2. Property `PromptPack Specification > agents > members > additionalProperties > tags`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |

**Description:** Discovery tags for the agent, used by A2A registries and routers.

**Examples:**

```json
[
    "support",
    "billing"
]
```

```json
[
    "sales",
    "enterprise"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                               | Description |
| ------------------------------------------------------------- | ----------- |
| [tags items](#agents_members_additionalProperties_tags_items) | -           |

###### <a name="agents_members_additionalProperties_tags_items"></a>14.2.1.2.1. PromptPack Specification > agents > members > additionalProperties > tags > tags items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

##### <a name="agents_members_additionalProperties_input_modes"></a>14.2.1.3. Property `PromptPack Specification > agents > members > additionalProperties > input_modes`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |
| **Default**  | `["text/plain"]`  |

**Description:** MIME types the agent accepts as input. Defaults to ["text/plain"] if omitted.

**Examples:**

```json
[
    "text/plain"
]
```

```json
[
    "text/plain",
    "image/png"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                             | Description |
| --------------------------------------------------------------------------- | ----------- |
| [input_modes items](#agents_members_additionalProperties_input_modes_items) | -           |

###### <a name="agents_members_additionalProperties_input_modes_items"></a>14.2.1.3.1. PromptPack Specification > agents > members > additionalProperties > input_modes > input_modes items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

##### <a name="agents_members_additionalProperties_output_modes"></a>14.2.1.4. Property `PromptPack Specification > agents > members > additionalProperties > output_modes`

|              |                   |
| ------------ | ----------------- |
| **Type**     | `array of string` |
| **Required** | No                |
| **Default**  | `["text/plain"]`  |

**Description:** MIME types the agent can produce as output. Defaults to ["text/plain"] if omitted.

**Examples:**

```json
[
    "text/plain"
]
```

```json
[
    "text/plain",
    "application/json"
]
```

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be                                               | Description |
| ----------------------------------------------------------------------------- | ----------- |
| [output_modes items](#agents_members_additionalProperties_output_modes_items) | -           |

###### <a name="agents_members_additionalProperties_output_modes_items"></a>14.2.1.4.1. PromptPack Specification > agents > members > additionalProperties > output_modes > output_modes items

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

## <a name="skills"></a>15. Property `PromptPack Specification > skills`

|              |         |
| ------------ | ------- |
| **Type**     | `array` |
| **Required** | No      |

**Description:** Skill sources for progressive-disclosure knowledge loading. Each entry is either a string (path or package reference), a SkillPathSource object, or an InlineSkill object.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |

| Each item of this array must be | Description                                                                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SkillSource](#skills_items)    | A skill source for progressive-disclosure knowledge loading. Can be a simple string path, a path object with preload config, or an inline skill definition. |

### <a name="skills_items"></a>15.1. PromptPack Specification > skills > SkillSource

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `combining`         |
| **Required**              | No                  |
| **Additional properties** | Any type allowed    |
| **Defined in**            | #/$defs/SkillSource |

**Description:** A skill source for progressive-disclosure knowledge loading. Can be a simple string path, a path object with preload config, or an inline skill definition.

| One of(Option)                            |
| ----------------------------------------- |
| [item 0](#skills_items_oneOf_i0)          |
| [SkillPathSource](#skills_items_oneOf_i1) |
| [InlineSkill](#skills_items_oneOf_i2)     |

#### <a name="skills_items_oneOf_i0"></a>15.1.1. Property `PromptPack Specification > skills > skills items > oneOf > item 0`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | No       |

**Description:** Path to a skill directory/file or a package reference (e.g., './skills', '@acme/billing-skills').

#### <a name="skills_items_oneOf_i1"></a>15.1.2. Property `PromptPack Specification > skills > skills items > oneOf > SkillPathSource`

|                           |                         |
| ------------------------- | ----------------------- |
| **Type**                  | `object`                |
| **Required**              | No                      |
| **Additional properties** | Not allowed             |
| **Defined in**            | #/$defs/SkillPathSource |

**Description:** A skill source with a path and optional preload configuration.

| Property                                     | Pattern | Type    | Deprecated | Definition | Title/Description                                                                     |
| -------------------------------------------- | ------- | ------- | ---------- | ---------- | ------------------------------------------------------------------------------------- |
| + [path](#skills_items_oneOf_i1_path )       | No      | string  | No         | -          | Path to a skill directory, file, or package reference.                                |
| - [preload](#skills_items_oneOf_i1_preload ) | No      | boolean | No         | -          | If true, load this skill source eagerly at pack initialization rather than on demand. |

##### <a name="skills_items_oneOf_i1_path"></a>15.1.2.1. Property `PromptPack Specification > skills > skills items > oneOf > item 1 > path`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Path to a skill directory, file, or package reference.

**Examples:**

```json
"./skills/billing"
```

```json
"@acme/billing-skills"
```

##### <a name="skills_items_oneOf_i1_preload"></a>15.1.2.2. Property `PromptPack Specification > skills > skills items > oneOf > item 1 > preload`

|              |           |
| ------------ | --------- |
| **Type**     | `boolean` |
| **Required** | No        |
| **Default**  | `false`   |

**Description:** If true, load this skill source eagerly at pack initialization rather than on demand.

**Examples:**

```json
true
```

```json
false
```

#### <a name="skills_items_oneOf_i2"></a>15.1.3. Property `PromptPack Specification > skills > skills items > oneOf > InlineSkill`

|                           |                     |
| ------------------------- | ------------------- |
| **Type**                  | `object`            |
| **Required**              | No                  |
| **Additional properties** | Not allowed         |
| **Defined in**            | #/$defs/InlineSkill |

**Description:** A skill defined inline within the pack. Useful for small, pack-specific skills that don't warrant a separate file.

| Property                                               | Pattern | Type   | Deprecated | Definition | Title/Description                                                                                           |
| ------------------------------------------------------ | ------- | ------ | ---------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| + [name](#skills_items_oneOf_i2_name )                 | No      | string | No         | -          | Human-readable name for this skill.                                                                         |
| + [description](#skills_items_oneOf_i2_description )   | No      | string | No         | -          | Brief description of what this skill provides.                                                              |
| + [instructions](#skills_items_oneOf_i2_instructions ) | No      | string | No         | -          | The skill's instructions or knowledge content. Loaded into the agent's context when the skill is activated. |

##### <a name="skills_items_oneOf_i2_name"></a>15.1.3.1. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > name`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Human-readable name for this skill.

**Examples:**

```json
"escalation-protocol"
```

```json
"refund-policy"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

##### <a name="skills_items_oneOf_i2_description"></a>15.1.3.2. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > description`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** Brief description of what this skill provides.

**Example:**

```json
"Steps for escalating unresolved customer issues"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

##### <a name="skills_items_oneOf_i2_instructions"></a>15.1.3.3. Property `PromptPack Specification > skills > skills items > oneOf > item 2 > instructions`

|              |          |
| ------------ | -------- |
| **Type**     | `string` |
| **Required** | Yes      |

**Description:** The skill's instructions or knowledge content. Loaded into the agent's context when the skill is activated.

**Example:**

```json
"When a customer issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity\n2. Collect case details\n3. Create an escalation ticket"
```

| Restrictions   |   |
| -------------- | - |
| **Min length** | 1 |

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2026-02-21 at 08:44:18 +0000
