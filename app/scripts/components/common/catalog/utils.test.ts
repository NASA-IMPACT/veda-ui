import { omit, set } from 'lodash';
import { CatalogActions, onCatalogAction } from './utils';

describe('onCatalogAction', () => {
  let setSearchMock;
  let setTaxonomiesMock;
  let taxonomies;

  beforeEach(() => {
    setSearchMock = jest.fn();
    setTaxonomiesMock = jest.fn();
    taxonomies = {
      Topics: ['air-quality', 'climate'],
      Sectors: ['electricity', 'energy']
    };
  });

  it('should clear search and taxonomies on CLEAR action', () => {
    onCatalogAction(
      CatalogActions.CLEAR,
      null,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setSearchMock).toHaveBeenCalledWith('');
    expect(setTaxonomiesMock).toHaveBeenCalledWith({});
  });

  it('should set search value on SEARCH action', () => {
    const searchValue = 'climate';
    onCatalogAction(
      CatalogActions.SEARCH,
      searchValue,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setSearchMock).toHaveBeenCalledWith(searchValue);
  });

  it('should add value to Topics taxonomy on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Topics', value: 'pollution' };
    onCatalogAction(
      CatalogActions.TAXONOMY_MULTISELECT,
      value,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      set({ ...taxonomies }, value.key, [...taxonomies[value.key], value.value])
    );
  });

  it('should remove value from Topics taxonomy on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Topics', value: 'climate' };
    onCatalogAction(
      CatalogActions.TAXONOMY_MULTISELECT,
      value,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    const updatedValues = ['air-quality'];
    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      set({ ...taxonomies }, value.key, updatedValues)
    );
  });

  it('should remove Topics key when last value is removed on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Topics', value: 'climate' };
    onCatalogAction(
      CatalogActions.TAXONOMY_MULTISELECT,
      value,
      { Topics: ['climate'] },
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      omit({ Topics: ['climate'] }, value.key)
    );
  });

  it('should initialize new taxonomy key on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Regions', value: 'Europe' };
    onCatalogAction(
      CatalogActions.TAXONOMY_MULTISELECT,
      value,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      set({ ...taxonomies }, value.key, [value.value])
    );
  });
});
