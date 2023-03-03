import { getFData } from '$components/common/chart/utils';

describe('uniqueKey of formatted data', () => {

  it('checks numeric character gets sorted', () => {
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

  it('checks how non-alphanumeric character gets sorted', () => {
    
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

  it('hecks how negative number is sorted', () => {
    
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
