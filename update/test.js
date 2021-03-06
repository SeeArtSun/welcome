const update = require("./update.js"); // <- this is the file you make;

describe("update", () => {
  describe("has a #$set method that", () => {
    var state;
    var commands;
    var nextState;
    beforeEach(() => {
      state = {
        a: {
          b: 22,
          c: 33
        },
        unChanged: {}
      };
      commands = { a: { c: { $set: 44 } } };
      nextState = update(state, commands);
    });

    it("changes the tree on the directive", () => {
      expect(state.a.c).not.toBe(nextState.a.c);
    });

    it("reuses state on different branches", () => {
      expect(state.unChanged).toBe(nextState.unChanged);
    });
  });

  describe("can pass react's test suite", () => {
    it("should support set", () => {
      expect(update({ a: "b" }, { $set: { c: "d" } })).toEqual({ c: "d" });
    });

    describe("push commands test", () => {
      it("should support push(basic)", () => {
        expect(update([1], { $push: [7] })).toEqual([1, 7]);
      });

      it("should support push(array object)", () => {
        expect(update({a: [1]}, { a: {$push: [7]} })).toEqual({a: [1, 7]});
      });
    });

    describe("unshift commands test", () => {
      it("should support unshift(basic)", () => {
        expect(update([1], { $unshift: [7] })).toEqual([7, 1]);
      });

      it("should support unshift(over 2 length of array)", () => {
        expect(update([1], { $unshift: [7, 8] })).toEqual([8, 7, 1]);
      });
    });

    it("should support merge", () => {
      expect(update({ a: "b" }, { $merge: { c: "d" } })).toEqual({
        a: "b",
        c: "d"
      });
    });

    describe("apply commands test", () => {
      it("should support apply(basic)", () => {
        expect(
          update(2, {
            $apply: function(x) {
              return x * 2;
            }
          })
        ).toBe(4);
      });

      it("should support apply(react example)", () => {
        const state = {a: 5, b: 3};
        const commands = {b: {$apply: function(x) {return x * 2;}}};
        expect(update(state, commands)).toEqual({a: 5, b: 6});
      });
    })

    it("should support deep updates", () => {
      expect(
        update({ a: "b", c: { d: "e" } }, { c: { d: { $set: "f" } } })
      ).toEqual({
        a: "b",
        c: { d: "f" }
      });
    });

    describe("splice command test", () => {
      it("should support splice(basic)", () => {
        expect(update([1, 4, 3], { $splice: [[1, 1, 2]] })).toEqual([1, 2, 3]);
      });

      it("should support splice Nested collections", () => {
        const state = [1, 2, {a: [12, 17, 15]}];
        const commands = {2: {a: {$splice: [[1, 1, 13, 14]]}}};
        expect(update(state, commands)).toEqual([1, 2, {a: [12, 13, 14, 15]}]);
      });
    })
  });
});
