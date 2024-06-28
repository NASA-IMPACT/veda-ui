import { omit, set } from 'lodash';
import { FilterActions, onFilterAction } from './utils';

describe('onFilterAction', () => {
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
    onFilterAction(
      FilterActions.CLEAR,
      null,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setSearchMock).toHaveBeenCalledWith('');
    expect(setTaxonomiesMock).toHaveBeenCalledWith({});
  });

  it('should clear only taxonomies on CLEAR_TAXONOMY action', () => {
    onFilterAction(
      FilterActions.CLEAR_TAXONOMY,
      null,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith({});
    expect(setSearchMock).not.toHaveBeenCalled();
  }); 

  it('should clear only search on CLEAR_SEARCH action', () => {
    onFilterAction(
      FilterActions.CLEAR_SEARCH,
      null,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setSearchMock).toHaveBeenCalledWith('');
    expect(setTaxonomiesMock).not.toHaveBeenCalled();
  }); 
  it('should set search value on SEARCH action', () => {
    const searchValue = 'climate';
    onFilterAction(
      FilterActions.SEARCH,
      searchValue,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setSearchMock).toHaveBeenCalledWith(searchValue);
  });

  it('should add value to Topics taxonomy on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Topics', value: 'pollution' };
    onFilterAction(
      FilterActions.TAXONOMY_MULTISELECT,
      value,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      set({ ...taxonomies }, value.key, [...taxonomies[value.key], value.value])
    );
  });

  it('should overwrite the existing taxonomy value with TAXONOMY action', () => {
    const value = { key: 'Topics', value: 'climate' };
    onFilterAction(
      FilterActions.TAXONOMY,
      value,
      taxonomies,
      setSearchMock,
      setTaxonomiesMock
    );

    expect(setTaxonomiesMock).toHaveBeenCalledWith(
      set({ ...taxonomies }, value.key, value.value)
    );
  });

  it('should remove value from Topics taxonomy on TAXONOMY_MULTISELECT action', () => {
    const value = { key: 'Topics', value: 'climate' };
    onFilterAction(
      FilterActions.TAXONOMY_MULTISELECT,
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
    onFilterAction(
      FilterActions.TAXONOMY_MULTISELECT,
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
    onFilterAction(
      FilterActions.TAXONOMY_MULTISELECT,
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
