module.exports = grammar({
  name: "larimar",

  rules: {
    source_file: ($) => repeat($._statement),
    
    _statement: ($) => choice(
      $.comment,
      $.identifier
    ),

    comment: ($) => seq("#", /.*/),
    
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
