; Larimar tags queries for Tree-sitter
; Used for code navigation (go to definition, find references, etc.)

; Function definitions
(function_definition
  name: (identifier) @name) @definition.function

(method_definition
  name: (identifier) @name) @definition.method

(method_definition
  name: "initialize" @name) @definition.method

; Type definitions
(class_definition
  name: (type_identifier) @name) @definition.class

(struct_definition
  name: (type_identifier) @name) @definition.class

(enum_definition
  name: (type_identifier) @name) @definition.class

(trait_definition
  name: (type_identifier) @name) @definition.interface

(module_definition
  name: (type_identifier) @name) @definition.module

(type_alias
  name: (type_identifier) @name) @definition.type

; Function calls
(call_expression
  function: (identifier) @name) @reference.call

(method_call_expression
  method: (identifier) @name) @reference.call
