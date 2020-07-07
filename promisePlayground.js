const trace = (value) => {
  console.info('trace', value);
  return value;
};

const template = '<li data-id="{{id}}">{{nome}}</li>';
const applyTemplate = (template) => item => template.replace('{{id}}', item.id).replace('{{nome}}', item.name);

fetch('./data/data2.json')
  .then((response) => response.json())
  .then((arr) => arr.map(applyTemplate(template)))
  .then((arr) => arr.join('\n'))
  .then((html) => document.querySelector('ul').innerHTML = html)
  .catch((err) => document.querySelector('p').innerHTML = err);
