"use strict";
module.exports = function(context, options = {}) {
    const {Syntax, RuleError, report, getSource} = context;
    return {
        [Syntax.Str](node){ // "Str" node
            const text = getSource(node); // Get text
            const matches = text.match(/(todo:|ＴＯＤＯ：)/g);
            if (!matches) {
                return;
            }
            var todoText = text.substring(matches.index);
            report(node, new RuleError("Found TODO: '" + todoText + "'", {
                index: matches.index
            }));
        }
    }
};
