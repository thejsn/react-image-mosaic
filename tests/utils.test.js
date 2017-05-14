import expect from 'expect'
import { isSame, propHasChanged } from '../src/utils';

describe('propHasChanged', () => {

  it('returns true if single props has changed', () => {
    
    const prev = { string: 'before', number: 0, array: [] };
    const next = { string: 'after', number: 1, array: [1, 2] };
    
    const stringResult = propHasChanged('string', next, prev);
    const numberResult = propHasChanged('number', next, prev);
    const arrayResult = propHasChanged('array', next, prev);

    expect(stringResult).toEqual(true);
    expect(numberResult).toEqual(true);
    expect(arrayResult).toEqual(true);
  })

  it('returns false if single props has not changed', () => {
    
    const prev = { string: 'same', number: 1, array: [1, 2] };
    const next = { string: 'same', number: 1, array: [1, 2] };
    
    const stringResult = propHasChanged('string', next, prev);
    const numberResult = propHasChanged('number', next, prev);
    const arrayResult = propHasChanged('array', next, prev);

    expect(stringResult).toEqual(false);
    expect(numberResult).toEqual(false);
    expect(arrayResult).toEqual(false);
  })

  it('returns true if prop in array has changed', () => {
    
    const prev = { a: 'before', b: 'same', c: 'same' };
    const next = { a: 'after', b: 'same', c: 'same' };
    
    const result = propHasChanged(['a', 'b', 'c'], next, prev);

    expect(result).toEqual(true)
  })

  it('returns false if prop in array has not changed', () => {
    
    const prev = { a: 'same', b: 'same', c: 'same' };
    const next = { a: 'same', b: 'same', c: 'same' };

    const result = propHasChanged(['a', 'b', 'c'], next, prev);

    expect(result).toEqual(false)
  })
})


