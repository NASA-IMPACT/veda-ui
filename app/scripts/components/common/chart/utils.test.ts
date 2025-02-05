import { getFData } from '$components/common/chart/utils';

describe('uniqueKey of formatted data from getFData', () => {

  it('checks how alpha + nummeric characters get sorted', () => {

    const idValues = ['a6','b','a22','c', 'z'];

    const uniqueKeyTestData = new Array(idValues.length)
    .fill(0)
    .map((_, idx) => ({
      idKey: idValues[idx],
      xKey: '2022',
      yKey: '10'
    }));

    const { uniqueKeys }  = getFData({
      data: uniqueKeyTestData,
      idKey: 'idKey',
      xKey: 'xKey',
      yKey: 'yKey',
      dateFormat :'%Y'
    });

    expect(uniqueKeys).toEqual(['a6','a22','b','c', 'z']);
  });

  it('checks characters with diacritic marks don\'t impact the sorting', () => {

    const idValues = ['Z', 'a2', 'z', 'ä1'];

    const uniqueKeyTestData = new Array(idValues.length)
    .fill(0)
    .map((_, idx) => ({
      idKey: idValues[idx],
      xKey: '2022',
      yKey: '10'
    }));

    const { uniqueKeys }  = getFData({
      data: uniqueKeyTestData,
      idKey: 'idKey',
      xKey: 'xKey',
      yKey: 'yKey',
      dateFormat :'%Y'
    });

    expect(uniqueKeys).toEqual(['ä1', 'a2', 'z', 'Z']);
  });

  it('checks numeric characters get sorted', () => {
    const idValues = ['0-5%', '5-10%', '15-20%', '20% < ', '10-15%'];

    const uniqueKeyTestData = new Array(idValues.length)
    .fill(0)
    .map((_, idx) => ({
      idKey: idValues[idx],
      xKey: '2022',
      yKey: '10'
    }));

    const { uniqueKeys }  = getFData({
      data: uniqueKeyTestData,
      idKey: 'idKey',
      xKey: 'xKey',
      yKey: 'yKey',
      dateFormat :'%Y'
    });

    expect(uniqueKeys).toEqual(['0-5%','5-10%','10-15%', '15-20%','20% < ']);
  });

  it('checks how non-alphanumeric characters get sorted', () => {

    const idValues = ['00-05% SVI',
    '05-10% SVI',
    '10-15% SVI',
    '15-20% SVI',
    '> 20%'];

    const uniqueKeyTestData = new Array(idValues.length)
    .fill(0)
    .map((_, idx) => ({
      idKey: idValues[idx],
      xKey: '2022',
      yKey: '10'
    }));

    const { uniqueKeys }  = getFData({
      data: uniqueKeyTestData,
      idKey: 'idKey',
      xKey: 'xKey',
      yKey: 'yKey',
      dateFormat :'%Y'
    });

    expect(uniqueKeys).toEqual(['> 20%',
    '00-05% SVI',
    '05-10% SVI',
    '10-15% SVI',
    '15-20% SVI']);
  });

  it('checks how negative numbers are sorted', () => {

    const idValues = ['-1','-2','-4','-5','-3'];

    const uniqueKeyTestData = new Array(idValues.length)
    .fill(0)
    .map((_, idx) => ({
      idKey: idValues[idx],
      xKey: '2022',
      yKey: '10'
    }));

    const { uniqueKeys }  = getFData({
      data: uniqueKeyTestData,
      idKey: 'idKey',
      xKey: 'xKey',
      yKey: 'yKey',
      dateFormat :'%Y'
    });

    expect(uniqueKeys).toEqual(['-1','-2','-3','-4','-5']);
  });
});
