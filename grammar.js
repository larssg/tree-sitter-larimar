/**
 * Tree-sitter grammar for the Larimar programming language
 *
 * A simplified grammar that handles the core syntax.
 * Some Ruby-style features (parenthesis-less calls) are simplified.
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  ASSIGN: 1,
  OR: 2,
  AND: 3,
  COMPARE: 4,
  BITWISE: 5,
  RANGE: 6,
  ADD: 7,
  MULT: 8,
  UNARY: 9,
  CALL: 10,
  MEMBER: 11,
};

module.exports = grammar({
  name: "larimar",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.primary_expression, $.pattern],
    [$.primary_expression, $._type],
    [$.enum_pattern, $.struct_pattern],
    [$.block, $.hash],
    [$.parameter, $.primary_expression],
    [$.method_call, $.member_expression],
    [$.type_parameter, $.primary_expression],
    [$._type, $.enum_pattern],
    [$._type, $.struct_pattern, $.enum_pattern],
    [$.primary_expression, $.enum_pattern],
    [$.parenthesized, $.arguments],
    [$.tuple, $.arguments],
    [$.array, $.array_pattern],
  ],

  rules: {
    source_file: ($) =>
      repeat(choice($._statement, $._terminator)),

    _terminator: ($) => choice(";", "\n"),

    // ============================================
    // STATEMENTS
    // ============================================

    _statement: ($) =>
      choice(
        $.let_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.function_definition,
        $.class_definition,
        $.struct_definition,
        $.enum_definition,
        $.trait_definition,
        $.impl_block,
        $.module_definition,
        $.use_statement,
        $.type_alias,
        $.expression
      ),

    let_statement: ($) =>
      seq(
        "let",
        optional("mut"),
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("value", $.expression)))
      ),

    return_statement: ($) =>
      prec.right(seq("return", optional($.expression))),

    break_statement: ($) =>
      prec.right(seq("break", optional($.expression))),

    continue_statement: ($) => "continue",

    // ============================================
    // FUNCTIONS
    // ============================================

    function_definition: ($) =>
      seq(
        optional($.visibility),
        optional(choice("inline", "async")),
        "def",
        field("name", $.identifier),
        optional($.type_parameters),
        optional($.parameters),
        optional(seq("->", field("return_type", $._type))),
        $._block_end
      ),

    parameters: ($) =>
      seq("(", commaSep($.parameter), ")"),

    parameter: ($) =>
      seq(
        field("name", choice($.identifier, $.instance_variable)),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("default", $.expression)))
      ),

    type_parameters: ($) =>
      seq("[", commaSep1($.type_parameter), "]"),

    type_parameter: ($) =>
      seq(
        field("name", $.type_identifier),
        optional(seq(":", field("bound", $._type)))
      ),

    visibility: ($) => choice("pub", "private", "protected"),

    _block_end: ($) => seq(optional($._statements), "end"),

    _statements: ($) => repeat1(choice($._statement, $._terminator)),

    // ============================================
    // CLASSES & TYPES
    // ============================================

    class_definition: ($) =>
      seq(
        "class",
        field("name", $.type_identifier),
        optional($.type_parameters),
        optional(seq("<", field("superclass", $._type))),
        $._block_end
      ),

    struct_definition: ($) =>
      seq(
        "struct",
        field("name", $.type_identifier),
        optional($.type_parameters),
        optional(repeat1(choice($.struct_field, $._terminator))),
        "end"
      ),

    struct_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    enum_definition: ($) =>
      seq(
        "enum",
        field("name", $.type_identifier),
        optional($.type_parameters),
        optional(repeat1(choice($.enum_variant, $._terminator))),
        "end"
      ),

    enum_variant: ($) =>
      seq(
        field("name", $.type_identifier),
        optional(choice(
          seq("(", commaSep($._type), ")"),
          seq("{", commaSep($.struct_field), "}")
        ))
      ),

    trait_definition: ($) =>
      seq(
        "trait",
        field("name", $.type_identifier),
        optional($.type_parameters),
        $._block_end
      ),

    impl_block: ($) =>
      seq(
        "impl",
        optional($.type_parameters),
        optional(seq(field("trait", $._type), "for")),
        field("type", $._type),
        $._block_end
      ),

    module_definition: ($) =>
      seq(
        "module",
        field("name", $.type_identifier),
        $._block_end
      ),

    use_statement: ($) =>
      seq("use", $.path),

    path: ($) =>
      seq(
        choice($.identifier, $.type_identifier),
        repeat(seq("::", choice($.identifier, $.type_identifier))),
        optional(choice(
          seq("::", "*"),
          seq("::", "{", commaSep1(choice($.identifier, $.type_identifier)), "}")
        ))
      ),

    type_alias: ($) =>
      seq("type", field("name", $.type_identifier), optional($.type_parameters), "=", field("type", $._type)),

    // ============================================
    // TYPES
    // ============================================

    _type: ($) =>
      choice(
        $.type_identifier,
        $.generic_type,
        $.function_type,
        $.tuple_type,
        $.optional_type,
        "Self",
        "Never"
      ),

    type_identifier: ($) => /[A-Z][a-zA-Z0-9_]*/,

    generic_type: ($) =>
      prec(1, seq($.type_identifier, "[", commaSep1($._type), "]")),

    function_type: ($) =>
      prec.right(seq("Fn", "(", commaSep($._type), ")", optional(seq("->", $._type)))),

    tuple_type: ($) =>
      seq("(", $._type, repeat1(seq(",", $._type)), ")"),

    optional_type: ($) =>
      prec.left(seq($._type, "?")),

    // ============================================
    // EXPRESSIONS
    // ============================================

    expression: ($) =>
      choice(
        $.assignment,
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.method_call,
        $.index_expression,
        $.member_expression,
        $.if_expression,
        $.unless_expression,
        $.match_expression,
        $.for_expression,
        $.while_expression,
        $.loop_expression,
        $.block,
        $.lambda,
        $.range_expression,
        $.primary_expression
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.type_identifier,
        $.instance_variable,
        "self",
        "super",
        $.integer,
        $.float,
        $.string,
        $.char,
        $.boolean,
        "None",
        seq("Some", "(", $.expression, ")"),
        seq("Ok", "(", $.expression, ")"),
        seq("Err", "(", $.expression, ")"),
        $.array,
        $.hash,
        $.tuple,
        $.struct_expression,
        $.path_expression,
        $.parenthesized,
        seq("spawn", $.block),
        seq("await", $.expression)
      ),

    instance_variable: ($) => /@[a-z_][a-zA-Z0-9_]*/,

    parenthesized: ($) => seq("(", $.expression, ")"),

    assignment: ($) =>
      prec.right(PREC.ASSIGN, seq($.expression, "=", $.expression)),

    binary_expression: ($) =>
      choice(
        prec.left(PREC.OR, seq($.expression, choice("or", "||"), $.expression)),
        prec.left(PREC.AND, seq($.expression, choice("and", "&&"), $.expression)),
        prec.left(PREC.COMPARE, seq($.expression, choice("==", "!=", "<", "<=", ">", ">="), $.expression)),
        prec.left(PREC.BITWISE, seq($.expression, choice("|", "&"), $.expression)),
        prec.left(PREC.ADD, seq($.expression, choice("+", "-"), $.expression)),
        prec.left(PREC.MULT, seq($.expression, choice("*", "/", "%"), $.expression)),
        prec.left(PREC.RANGE, seq($.expression, "|>", $.expression))
      ),

    unary_expression: ($) =>
      prec(PREC.UNARY, seq(choice("-", "!", "not"), $.expression)),

    range_expression: ($) =>
      prec.left(PREC.RANGE, seq($.expression, choice("..", "..."), $.expression)),

    call_expression: ($) =>
      prec.left(PREC.CALL, seq(
        field("function", $.expression),
        field("arguments", $.arguments),
        optional(field("block", $.block))
      )),

    method_call: ($) =>
      prec.left(PREC.MEMBER, seq(
        field("receiver", $.expression),
        ".",
        field("method", $.identifier),
        optional(field("arguments", $.arguments)),
        optional(field("block", $.block))
      )),

    arguments: ($) => seq("(", commaSep($.expression), ")"),

    member_expression: ($) =>
      prec.left(PREC.MEMBER, seq($.expression, ".", $.identifier)),

    index_expression: ($) =>
      prec.left(PREC.MEMBER, seq($.expression, "[", $.expression, "]")),

    path_expression: ($) =>
      seq($.type_identifier, repeat1(seq("::", choice($.identifier, $.type_identifier)))),

    // ============================================
    // CONTROL FLOW
    // ============================================

    if_expression: ($) =>
      prec.right(seq(
        "if",
        field("condition", $.expression),
        optional("then"),
        optional($._statements),
        repeat($.elsif_clause),
        optional($.else_clause),
        "end"
      )),

    elsif_clause: ($) =>
      seq("elsif", field("condition", $.expression), optional("then"), optional($._statements)),

    else_clause: ($) =>
      seq("else", optional($._statements)),

    unless_expression: ($) =>
      prec.right(seq(
        "unless",
        field("condition", $.expression),
        optional("then"),
        optional($._statements),
        optional($.else_clause),
        "end"
      )),

    match_expression: ($) =>
      seq(
        "match",
        field("value", $.expression),
        repeat(choice($.match_arm, $._terminator)),
        "end"
      ),

    match_arm: ($) =>
      seq(field("pattern", $.pattern), optional(seq("if", $.expression)), "=>", field("body", $.expression)),

    for_expression: ($) =>
      prec.right(seq(
        "for",
        field("pattern", $.pattern),
        "in",
        field("iterator", $.expression),
        optional($._statements),
        "end"
      )),

    while_expression: ($) =>
      prec.right(seq(
        "while",
        field("condition", $.expression),
        optional($._statements),
        "end"
      )),

    loop_expression: ($) =>
      prec.right(seq("loop", optional($._statements), "end")),

    // ============================================
    // BLOCKS & LAMBDAS
    // ============================================

    block: ($) =>
      seq("{", optional($.block_params), optional($._statements), "}"),

    block_params: ($) =>
      seq("|", commaSep($.identifier), "|"),

    lambda: ($) =>
      prec.right(PREC.UNARY, seq(
        "->",
        optional(seq("(", commaSep($.parameter), ")")),
        choice(
          seq("{", optional($._statements), "}"),
          $.expression
        )
      )),

    // ============================================
    // PATTERNS
    // ============================================

    pattern: ($) =>
      choice(
        "_",
        $.identifier,
        $.integer,
        $.string,
        $.boolean,
        "None",
        $.typed_pattern,
        $.tuple_pattern,
        $.array_pattern,
        $.struct_pattern,
        $.enum_pattern
      ),

    typed_pattern: ($) =>
      prec(1, seq($.identifier, ":", $._type)),

    tuple_pattern: ($) =>
      seq("(", commaSep1($.pattern), ")"),

    array_pattern: ($) =>
      seq("[", commaSep($.pattern), "]"),

    struct_pattern: ($) =>
      seq($.type_identifier, "{", commaSep($.field_pattern), "}"),

    field_pattern: ($) =>
      choice(seq($.identifier, ":", $.pattern), $.identifier),

    enum_pattern: ($) =>
      prec.right(seq(
        choice($.type_identifier, $.path_expression),
        optional(choice(
          seq("(", commaSep($.pattern), ")"),
          seq("{", commaSep($.field_pattern), "}")
        ))
      )),

    // ============================================
    // LITERALS
    // ============================================

    integer: ($) =>
      token(choice(
        /[0-9][0-9_]*/,
        /0x[0-9a-fA-F_]+/,
        /0o[0-7_]+/,
        /0b[01_]+/
      )),

    float: ($) =>
      token(/[0-9][0-9_]*\.[0-9][0-9_]*([eE][+-]?[0-9_]+)?/),

    string: ($) =>
      seq(
        '"',
        repeat(choice(
          token.immediate(prec(1, /[^"\\#]+/)),
          $.escape_sequence,
          token.immediate("#"),
          $.interpolation
        )),
        '"'
      ),

    escape_sequence: ($) =>
      token.immediate(/\\[nrtv0\\"']/),

    interpolation: ($) =>
      seq(token.immediate("#{"), $.expression, "}"),

    char: ($) =>
      seq("'", choice(/[^'\\]/, $.escape_sequence), "'"),

    boolean: ($) => choice("true", "false"),

    array: ($) => seq("[", commaSep($.expression), "]"),

    hash: ($) => seq("{", commaSep($.hash_entry), "}"),

    hash_entry: ($) => seq($.expression, "=>", $.expression),

    // Tuple requires trailing comma to disambiguate from arguments/parenthesized
    tuple: ($) => seq("(", commaSep1($.expression), ",", ")"),

    struct_expression: ($) =>
      prec(1, seq($.type_identifier, "{", commaSep($.field_init), "}")),

    field_init: ($) =>
      seq(field("name", $.identifier), ":", field("value", $.expression)),

    // ============================================
    // IDENTIFIERS & COMMENTS
    // ============================================

    identifier: ($) => /[a-z_][a-zA-Z0-9_]*[?!]?/,

    comment: ($) =>
      token(choice(
        seq("##", /.*/),
        seq("#", /.*/)
      )),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}
