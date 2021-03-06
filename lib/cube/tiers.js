'use strict';

var tiers = module.exports = {};

var second = 1000,
    second10 = 10 * second,
    minute = 60 * second,
    minute5 = 5 * minute,
    hour = 60 * minute,
    day = 24 * hour,
    week = 7 * day,
    month = 31 * day;

tiers[second10] = {
  key: second10,
  floor: function(d) { return new Date(Math.floor(d / second10) * second10); },
  bin:   function(d) { return new Date(Math.floor(d / second10) * second10); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + second10); },
  store: false
};

tiers[minute] = {
  key: minute,
  floor: function(d) { return new Date(Math.floor(d / minute) * minute); },
  bin:   function(d) { return new Date(Math.floor(d / minute) * minute); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + minute); },
  store: false
};

tiers[minute5] = {
  key: minute5,
  floor: function(d) { return new Date(Math.floor(d / minute5) * minute5); },
  bin:   function(d) { return new Date(Math.floor(d / minute5) * minute5); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + minute5); }
};

tiers[hour] = {
  key: hour,
  floor: function(d) { return new Date(Math.floor(d / hour) * hour); },
  bin:   function(d) { return new Date(Math.floor(d / hour) * hour); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + hour); },
  next:  tiers[minute5],
  size:  function() { return 12; }
};

tiers[day] = {
  key: day,
  floor: function(d) { return new Date(Math.floor(d / day) * day); },
  bin:   function(d) { return new Date(Math.floor(d / day) * day); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + day); },
  next:  tiers[hour],
  size:  function() { return 24; }
};

tiers[week] = {
  key:   week,
  floor: function(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()); },
  bin:   function(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()); },
  ceil:  tier_ceil,
  step:  function(d) { return new Date(+d + week); },
  next:  tiers[day],
  size:  function(d) { return 7; }
};

tiers[month] = {
  key:   month,
  floor: function(d) { return new Date(d.getFullYear(), d.getMonth(), 1); },
  bin:   function(d) { return new Date(d.getFullYear(), d.getMonth(), 1); },
  ceil:  tier_ceil,
  step:  function(d) { return d = new Date(d), d.setMonth(d.getMonth()+1), d; },
  next:  tiers[day],
  size:  function(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); }
};

Object.defineProperty(tiers, "bins", {
  enumberable: false,
  value: function(d){
    var bins = {};
    for(var bin in tiers) bins[tiers[bin].key] = tiers[bin].bin(d);
    return bins;
  }
});

Object.defineProperty(tiers, "units", {
  enumberable: false,
  value: { second: second, second10: second10, minute: minute, minute5: minute5, hour: hour, day: day }
});



function tier_ceil(date) {
  return this.step(this.floor(new Date(date - 1)));
}
