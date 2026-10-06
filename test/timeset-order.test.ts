import { RRule } from '../src'
import { datetime } from './lib/utils'

describe('unsorted time components', () => {
  it('expands unsorted byhour values in chronological order', () => {
    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: datetime(2024, 1, 1),
      byhour: [16, 1],
      count: 4,
    })

    expect(rule.all()).toEqual([
      datetime(2024, 1, 1, 1),
      datetime(2024, 1, 1, 16),
      datetime(2024, 1, 2, 1),
      datetime(2024, 1, 2, 16),
    ])
  })

  it('counts the earliest unsorted byminute values', () => {
    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: datetime(2024, 1, 1),
      byhour: 9,
      byminute: [45, 15],
      count: 3,
    })

    expect(rule.all()).toEqual([
      datetime(2024, 1, 1, 9, 15),
      datetime(2024, 1, 1, 9, 45),
      datetime(2024, 1, 2, 9, 15),
    ])
  })

  it('expands unsorted hours, minutes and seconds chronologically', () => {
    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: datetime(2024, 1, 1),
      byhour: [16, 1],
      byminute: [45, 15],
      bysecond: [40, 10],
      count: 5,
    })

    expect(rule.all()).toEqual([
      datetime(2024, 1, 1, 1, 15, 10),
      datetime(2024, 1, 1, 1, 15, 40),
      datetime(2024, 1, 1, 1, 45, 10),
      datetime(2024, 1, 1, 1, 45, 40),
      datetime(2024, 1, 1, 16, 15, 10),
    ])
  })

  it('does not skip earlier hours in subdaily rules with day filters', () => {
    const rule = new RRule({
      freq: RRule.MINUTELY,
      dtstart: datetime(2023, 12, 31, 23, 0, 0),
      bymonth: [10, 5],
      byweekday: [RRule.MO, RRule.WE],
      byhour: [16, 1],
      count: 2,
    })

    expect(rule.all()).toEqual([
      datetime(2024, 5, 1, 1, 0, 0),
      datetime(2024, 5, 1, 1, 1, 0),
    ])
  })

  it('sorts parsed time components without changing the original options', () => {
    const options = {
      freq: RRule.DAILY,
      dtstart: datetime(2024, 1, 1),
      byhour: [16, 1],
      byminute: [45, 15],
      bysecond: [40, 10],
    }
    const rule = new RRule(options)

    expect(rule.options.byhour).toEqual([1, 16])
    expect(rule.options.byminute).toEqual([15, 45])
    expect(rule.options.bysecond).toEqual([10, 40])
    expect(rule.origOptions).toEqual(options)
    expect(options.byhour).toEqual([16, 1])
  })

  it('lists hours in ascending order in the text description', () => {
    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: datetime(2024, 1, 1),
      byhour: [16, 1],
      count: 4,
    })

    expect(rule.toText()).toBe('every day at 1 and 16 for 4 times')
    expect(rule.toString()).toBe(
      'DTSTART:20240101T000000Z\nRRULE:FREQ=DAILY;BYHOUR=16,1;COUNT=4'
    )
  })
})
