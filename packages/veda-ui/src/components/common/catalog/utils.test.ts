import { omit, set } from 'lodash';
import { FormatBlock } from '../types';
import {
  FilterActions,
  getDatasetDescription,
  getDescription,
  getMediaProperty,
  onFilterAction
} from './utils';
import { DatasetData, DatasetLayer, StoryData } from '$types/veda';

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

describe('getDescription', () => {
  it('should return cardDescription when available', () => {
    const data = {
      description: 'Regular description',
      cardDescription: 'Card description'
    } as DatasetData;

    expect(getDescription(data)).toBe('Card description');
  });

  it('should fall back to description when cardDescription is not available', () => {
    const data = {
      description: 'Regular description'
    } as DatasetData;

    expect(getDescription(data)).toBe('Regular description');
  });

  it('works with different data types', () => {
    const dataset = {
      description: 'Dataset description',
      cardDescription: 'Dataset card description'
    } as DatasetData;

    const story = {
      description: 'Story description',
      cardDescription: 'Story card description'
    } as StoryData;

    const layer = {
      description: 'Layer description',
      cardDescription: 'Layer card description'
    } as DatasetLayer;

    expect(getDescription(dataset)).toBe('Dataset card description');
    expect(getDescription(story)).toBe('Story card description');
    expect(getDescription(layer)).toBe('Layer card description');
  });

  it('works with FormatBlock', () => {
    const formatBlock = {
      id: '1',
      name: 'Test',
      description: 'Format block description',
      cardDescription: 'Format block card description',
      date: '2024-01-01',
      link: '/test',
      parentLink: '/parent',
      media: { src: 'src', alt: 'alt' },
      parent: 'story'
    } as FormatBlock;

    expect(getDescription(formatBlock)).toBe('Format block card description');
  });

  it('works with FormatBlock without cardDescription', () => {
    const formatBlock = {
      id: '1',
      name: 'Test',
      description: 'Format block description',
      date: '2024-01-01',
      link: '/test',
      parentLink: '/parent',
      media: { src: 'src', alt: 'alt' },
      parent: 'story'
    } as FormatBlock;

    expect(getDescription(formatBlock)).toBe('Format block description');
  });

  it('handles empty strings in description fields', () => {
    const data = {
      description: '',
      cardDescription: ''
    } as DatasetData;

    expect(getDescription(data)).toBe('');
  });

  it('handles undefined cardDescription', () => {
    const data = {
      description: 'Regular description',
      cardDescription: undefined
    } as DatasetData;

    expect(getDescription(data)).toBe('Regular description');
  });
});

describe('getDatasetDescription', () => {
  const dataset = {
    description: 'Dataset description',
    cardDescription: 'Dataset card description'
  } as DatasetData;

  const layer = {
    description: 'Layer description',
    cardDescription: 'Layer card description'
  } as DatasetLayer;

  it('should return layer description when layer is provided', () => {
    expect(getDatasetDescription(layer, dataset)).toBe(
      'Layer card description'
    );
  });

  it('should return dataset description when no layer is provided', () => {
    expect(getDatasetDescription(undefined, dataset)).toBe(
      'Dataset card description'
    );
  });

  it('should handle layer without cardDescription', () => {
    const layerWithoutCard = {
      description: 'Layer description'
    } as DatasetLayer;

    expect(getDatasetDescription(layerWithoutCard, dataset)).toBe(
      'Layer description'
    );
  });

  it('should work with story data', () => {
    const story = {
      description: 'Story description',
      cardDescription: 'Story card description'
    } as StoryData;

    expect(getDatasetDescription(undefined, story)).toBe(
      'Story card description'
    );
  });
});

describe('getMediaProperty', () => {
  const dataset = {
    media: {
      src: 'dataset-src',
      alt: 'dataset-alt'
    },
    cardMedia: {
      src: 'dataset-card-src',
      alt: 'dataset-card-alt'
    }
  } as DatasetData;

  const layer = {
    media: {
      src: 'layer-src',
      alt: 'layer-alt'
    },
    cardMedia: {
      src: 'layer-card-src',
      alt: 'layer-card-alt'
    }
  } as DatasetLayer;

  it('should follow precedence order for src property', () => {
    // Test full precedence chain
    expect(getMediaProperty(layer, dataset, 'src')).toBe('layer-card-src');

    // Test without layer cardMedia
    const layerNoCard = { ...layer, cardMedia: undefined };
    expect(getMediaProperty(layerNoCard, dataset, 'src')).toBe('layer-src');

    // Test without layer
    expect(getMediaProperty(undefined, dataset, 'src')).toBe(
      'dataset-card-src'
    );

    // Test with minimal data
    const minimalDataset = {
      media: { src: 'only-src', alt: 'only-alt' }
    } as DatasetData;
    expect(getMediaProperty(undefined, minimalDataset, 'src')).toBe('only-src');
  });

  it('should follow precedence order for alt property', () => {
    expect(getMediaProperty(layer, dataset, 'alt')).toBe('layer-card-alt');

    const layerNoCard = { ...layer, cardMedia: undefined };
    expect(getMediaProperty(layerNoCard, dataset, 'alt')).toBe('layer-alt');

    expect(getMediaProperty(undefined, dataset, 'alt')).toBe(
      'dataset-card-alt'
    );
  });

  it('should work with FormatBlock', () => {
    const formatBlock = {
      id: '1',
      name: 'Test',
      description: 'description',
      date: '2024-01-01',
      link: '/test',
      parentLink: '/parent',
      media: { src: 'media-src', alt: 'media-alt' },
      cardMedia: { src: 'card-src', alt: 'card-alt' },
      parent: 'story'
    } as FormatBlock;

    expect(getMediaProperty(undefined, formatBlock, 'src')).toBe('card-src');
    expect(getMediaProperty(undefined, formatBlock, 'alt')).toBe('card-alt');
  });

  it('should fall back to media in FormatBlock when cardMedia is not available', () => {
    const formatBlock = {
      id: '1',
      name: 'Test',
      description: 'description',
      date: '2024-01-01',
      link: '/test',
      parentLink: '/parent',
      media: { src: 'media-src', alt: 'media-alt' },
      parent: 'story'
    } as FormatBlock;

    expect(getMediaProperty(undefined, formatBlock, 'src')).toBe('media-src');
    expect(getMediaProperty(undefined, formatBlock, 'alt')).toBe('media-alt');
  });

  it('should work with layer and FormatBlock combination', () => {
    const formatBlock = {
      id: '1',
      name: 'Test',
      description: 'description',
      date: '2024-01-01',
      link: '/test',
      parentLink: '/parent',
      media: { src: 'media-src', alt: 'media-alt' },
      cardMedia: { src: 'card-src', alt: 'card-alt' },
      parent: 'story'
    } as FormatBlock;

    expect(getMediaProperty(layer, formatBlock, 'src')).toBe('layer-card-src');
    expect(getMediaProperty(layer, formatBlock, 'alt')).toBe('layer-card-alt');
  });

  it('should return empty string when no media is available', () => {
    const emptyDataset = {} as DatasetData;
    expect(getMediaProperty(undefined, emptyDataset, 'src')).toBe('');
    expect(getMediaProperty(undefined, emptyDataset, 'alt')).toBe('');
  });

  it('should work with story data', () => {
    const story = {
      media: { src: 'story-src', alt: 'story-alt' },
      cardMedia: { src: 'story-card-src', alt: 'story-card-alt' }
    } as StoryData;

    expect(getMediaProperty(undefined, story, 'src')).toBe('story-card-src');
    expect(getMediaProperty(undefined, story, 'alt')).toBe('story-card-alt');
  });
});
