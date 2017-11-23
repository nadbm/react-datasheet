/**
 * Filter cell extra attributes to get only the valid ones. Right now the only
 * valid extra attributes are the ones with the data prefix. This is an object
 * where the key is the attribute name and the value is its value.
 * Ex: {data-hint: 'Hint to display on cell hover'}
 *
 * @param { object } attributes  Extra attributes of the cell.
 * @return { object } Filtered attributes. An empty object if there is no attributes.
 */
export const filterCellExtraAttributes = attributes => {
  const filteredAttribs = {};

  if (attributes) {
    Object.keys(attributes).forEach(attribName => {
      if (attribName.indexOf('data-') === 0) {
        filteredAttribs[attribName] = attributes[attribName];
      }
    });
  }

  return filteredAttribs;
}