; Larimar locals queries for Tree-sitter
; Defines scopes, definitions, and references for semantic analysis

; ============================================
; SCOPES
; ============================================

(source_file) @local.scope

(function_definition) @local.scope
(method_definition) @local.scope
(class_definition) @local.scope
(struct_definition) @local.scope
(enum_definition) @local.scope
(trait_definition) @local.scope
(impl_block) @local.scope
(module_definition) @local.scope

(if_expression) @local.scope
(elsif_clause) @local.scope
(else_clause) @local.scope
(unless_expression) @local.scope
(match_expression) @local.scope
(match_arm) @local.scope

(for_expression) @local.scope
(while_expression) @local.scope
(until_expression) @local.scope
(loop_expression) @local.scope

(block) @local.scope
(lambda) @local.scope

(try_expression) @local.scope
(comptime_block) @local.scope

; ============================================
; DEFINITIONS
; ============================================

; Variable definitions
(let_statement
  pattern: (binding_pattern
    (identifier) @local.definition))

(let_statement
  pattern: (typed_pattern
    pattern: (identifier) @local.definition))

; Function definitions
(function_definition
  name: (identifier) @local.definition)

(method_definition
  name: (identifier) @local.definition)

; Parameters
(parameter
  name: (identifier) @local.definition)

(block_parameter
  name: (identifier) @local.definition)

; For loop bindings
(for_expression
  pattern: (binding_pattern
    (identifier) @local.definition))

; Type definitions
(class_definition
  name: (type_identifier) @local.definition)

(struct_definition
  name: (type_identifier) @local.definition)

(enum_definition
  name: (type_identifier) @local.definition)

(trait_definition
  name: (type_identifier) @local.definition)

(module_definition
  name: (type_identifier) @local.definition)

(type_alias
  name: (type_identifier) @local.definition)

; Type parameters
(type_parameter
  name: (type_identifier) @local.definition)

; ============================================
; REFERENCES
; ============================================

(identifier) @local.reference
(type_identifier) @local.reference
