/*
  Example Unit Test
 */

import hamsters from '../src/core.js';

describe("Hamsters Core Functionality", function() {
  hamsters.init({
    maxThreads: 1,
    persistence: false,
    cache: false
  });

  alert(hamsters.habitat);
  // for(var key in hamsters.habitat) {
  //   if(hamsters.habitat.hasOwnProperty(key)) {
  //     it("Hamsters.habitat."+key+" should be boolean", function() {
  //       expect(hamsters.habitat[key]).toMatch(/true|false/);
  //     });
  //   }
  // }

  // it("Hamsters.tools.aggregate should aggregate array of subarrays", function() {
  //   expect(hamsters.tools.aggregate([[1],[2]])).toEqual([1,2]);
  // });

  // it("Hamsters.tools.splitArray should split array into subarrays", function() {
  //   expect(hamsters.tools.splitArray([1,2], 2)).toEqual([[1],[2]]);
  // });

  it("Hamsters.wheel.newTask should create new task", function() {
    var task = hamsters.wheel.newTask(0, 1, null, 'int32', "rtn.data.push(params.array)", null);
    expect(hamsters.wheel.tasks[task.id]).not.toBeNull();
  });

  it("Hamsters.wheel.trackInput should track thread input", function() {
    var task = hamsters.wheel.newTask(0, 1, null, 'int32', "rtn.data.push(params.array)", null);
    var input = hamsters.wheel.trackInput([], 1, hamsters.wheel.tasks[0], {num: 32});
    expect(hamsters.wheel.tasks[task.id].input).not.toBeNull();
  });

  describe("WebHamsters running asynchronously", function() {
    beforeEach(function(done) {
      done();
    });
    var dataTypes = ['Int8','Int16','Int32','Float32','Float64','Uint16','Uint32','Uint8', null];
    for (var i = dataTypes.length - 1; i >= 0; i--) {
      it("Computes 8th Fibonacci Number ("+dataTypes[i]+")", function(done) {
        hamsters.run({num: 7}, function() {
          var fib = function(n) {
            if (n < 2) {
              return 1;
            } else {
              return fib(n-2) + fib(n-1);
            }
          }
          rtn.data.push(fib(params.num-1));
        }, function(res) {
          result = res[0];
          expect(result).toEqual(13);
          done();
        }, 1, true, dataTypes[i], true);
      });
    }

    for (var i = dataTypes.length - 1; i >= 0; i--) {
      it("Calculates square root of 4000 ("+dataTypes[i]+")", function(done) {
        hamsters.run({num: 4000}, function() {
          rtn.data.push(Math.floor(Math.sqrt(params.num)));
        }, function(res) {
          result = res[0];
          expect(result).toEqual(63);
          done();
        }, 1, true, dataTypes[i], true);
      });
    }

    it("Should stringify json to string", function(done) {
      var json = {test: 1};
      hamsters.tools.stringifyJson(json, function(string) {
        expect(typeof string).toEqual('string');
        done();
      });
    });

    it("Should parse string to json", function(done) {
      var string = '{"test": 1}';
      hamsters.tools.parseJson(string, function(json) {
        expect(typeof json).toEqual('object');
        done();
      });
    });

    it("Hamsters.tools.loop should abstract for loop usage", function(done) {
      var op = function(i) {
        return arguments[0] * 2;
      };
      hamsters.tools.loop({
        operator: op,
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        startIndex: 0,
        dataType: 'Int32',
        incrementBy: 1,
        threads: 2
      }, function(output) {
        if(hamsters.wheel.env.transferrable) {
          expect(output).toEqual(new Int32Array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]));
        } else {
          expect(output).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]);
        }
        done();
      });
    });
  });
});

