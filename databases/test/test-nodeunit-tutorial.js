exports.testSomething = function(test) {
  test.expect(1);
  test.ok(true, "this assertion should pass");
  test.done();
};

exports.testSomethingElse = function(test) {
  test.ok(!false, "this assertion should fail");
  test.done();
};

exports.testSomethingMore = function(test) {
  test.expect(2);
  test.notEqual("this", "that");
  test.equal(true, 1);
  test.done();
};