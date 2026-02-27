export const SubAnSup = {
  extensions: [
    {
      name: 'superscript',
      level: 'inline',
      start(src) { return src.indexOf('^'); },
      tokenizer(src) {
        const rule = /^\^([^\s^]+)\^/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'superscript',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        return `<sup>${token.text}</sup>`;
      }
    },
    {
      name: 'subscript',
      level: 'inline',
      start(src) { return src.indexOf('~'); },
      tokenizer(src) {
        const rule = /^~([^\s~]+)~/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'subscript',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        return `<sub>${token.text}</sub>`;
      }
    }
  ]
}

export const Mark = {
  extensions: [
    {
      name: 'markText',
      level: 'inline',
      start(src) { return src.indexOf('=='); },
      tokenizer(src) {
        const rule = /^==([^\s==]+)==/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'markText',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        return `<mark>${token.text}</mark>`;
      }
    }
  ]
}
