var resourceful = require('resourceful');

var Group = resourceful.define('group', function () {
    this.use('memory');

    this.string('name');
    this.number('count');
});

var groups = [
    {
        id: "1",
        name: "innebandy!",
        count: 2
    },
    {
        id: "2",
        name: "ostprovning",
        count: 200
    },
    {
        id: "3",
        name: "coding jam",
        count: 1337
    },
    {
        id: "4",
        name: "spelkväll",
        count: 66
    }
];

var api = {
    findAll: function(req, res) {
        Group.all(function(err, result){
            res.send(result);
        });
    },
    findById: function(req, res) {
        Group.get(req.params.id, function(err, group) {
            if(!err) {
                group.update({ count: group.count+1}, function(err, result){
                    res.send(result);
                });
            }
        });
    },
    populate: function() {
        for(var i in groups) {
            Group.create(groups[i]);
        }
    },
    data: groups
};

module.exports = api;