Events = new Mongo.Collection('events');

Accounts.config({
  forbidClientAccountCreation : true,
})

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

  $.cloudinary.config({
    cloud_name: "lets"
  });

  Template.body.helpers({
    events: function () {
      return Events.find({});
    }
  });

  Template.body.events({
    "click .seja-parceiro": function (event) {
      alert('Bela iniciativa! Entre em contato conosco para conversar sobre parceiria [<o>] ')
    },
    "click .buy-drink": function (event) {
      alert('Obrigado! Olha nossos próximos eventos no Meetup e vêm compartilhar este drink conosco :D !')
    },
    "submit .new-event": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var name = event.target.name.value;
      var datetime = event.target.datetime.value;
      var website = event.target.website.value;
      var images = event.target.image.files;
      var description = event.target.description.value;

      var city = event.target.city.value;
      var place = event.target.place.value;
      var address = event.target.address.value;

      var contato = event.target.contato.value;
      var email = event.target.email.value;
 
      if (name && datetime && contato && email && description && images) {

        // Insert an event into the collection
        event_id = Events.insert({
          name: name,
          datetime: datetime,
          website: website,
          description: description,

          city: city,
          place: place,
          address: address,

          contato: contato,
          email: email,

          createdAt: new Date() // current time
        });

        Cloudinary.upload(images, {}, function(err, res) {
          if (err) {
            alert("A imagem não foi carregada.");
          } else {
            if (res.public_id) {
              Events.update(event_id, {
                $set: { image: res.public_id }
              });
              console.log('Image ' + res.public_id + ' saved');
            }
          }
        });
   
        // Clear form
        event.target.name.value = "";
        event.target.datetime.value = "";
        event.target.website.value = "";
        event.target.imagepath.value = "";
        event.target.description.value = "";

        event.target.city.value = "";
        event.target.place.value = "";
        event.target.address.value = "";

        event.target.contato.value = "";
        event.target.email.value = "";
      } else {
        alert("Por favor preencher todos os campos requiridos");
      }
    }
  });

  Template.event.helpers({
    isAdmin: function() {
      return Meteor.user();
    },
    descriptionHtml: function() {
      return this.description.replace(/\r?\n/g, "<br>");
    },
  });

  Template.event.events({
    "click .delete": function () {
      if (confirm('Tem certeza que deseja deletar "' + this.name + '"')) {
        Events.remove(this._id);
      }
    }
  });

}

if (Meteor.isServer) {
  Cloudinary.config({
    cloud_name: 'lets',
    api_key: '924521254223698',
    api_secret: 's2GiPJ4TVqUzvDXCSxUY6oPTunY'
  });

  Meteor.startup(function () {
    // code to run on server at startup
    if (Accounts.findUserByUsername("admin") == null) {
      Accounts.createUser({
        "username": "admin",
        "password": "CC2016"
      });
    }
  });
}
