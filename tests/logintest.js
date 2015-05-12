module.exports = {
  'Test login functionality' : function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('a.home', 1000)
      .click('a.home[ui-sref=login]')
      .pause(1000)
      .assert.containsText('.main-content', 'Beer.Me')
      .setValue('input[name=email]','rob@rob.com')
      .setValue('input[name=password]','robrob')
      .click('button[type=submit]')
      .pause(1000)
      .assert.containsText('body', 'Share your beer')
      .end();
  }
};
