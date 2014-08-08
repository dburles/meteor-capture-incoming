if (Meteor.isClient) {
  Meteor.subscribe('feed');

  Template.feed.created = function() {
    Session.set('feedPopulatedAt', new Date());
  };

  Template.feed.helpers({
    incoming: function() {
      return Feed.find({ createdAt: { $gt: Session.get('feedPopulatedAt') }}, { sort: { createdAt: -1 }});
    },
    feed: function() {
      return Feed.find({ createdAt: { $lte: Session.get('feedPopulatedAt') }}, { sort: { createdAt: -1 }});
    }
  });

  Template.feed.events({
    'click .new': function() {
      Session.set('feedPopulatedAt', new Date());
    }
  });
}

Feed = new Meteor.Collection('feed');

Factory.define('feed', Feed, {
  createdAt: function() { return new Date(); },
  name: function() { return Fake.user().fullname; },
  message: function() { return Fake.sentence(); }
});

if (Meteor.isServer) {
  Meteor.setInterval(function() {
    Factory.create('feed');
  }, 3000);

  Meteor.startup(function() {
    Meteor.publish('feed', function() {
      return Feed.find({}, { sort: { createdAt: -1 }});
    });
  });
}
