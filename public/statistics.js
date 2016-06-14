var j = new Jinaga();
j.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));

function sessionsInDay(d) {
    return {
        type: 'DAH.Meta.Session',
        day: d
    };
}

function stepsInSession(s) {
    return {
        type: 'DAH.Meta.Step',
        session: s
    };
}

var ViewModel = function () {
    var sessions = ko.observableArray([]);

    var now = new Date();
    var day = {
        type: 'DAH.Meta.Day',
        application: {
            type: 'DAH.Meta.Application',
            identifier: distributorUrl
        },
        year: now.getUTCFullYear(),
        month: now.getUTCMonth(),
        date: now.getUTCDate()
    };
    var sessionWatch = j.watch(day, [sessionsInDay], function (session) {
        var sessionViewModel = new SessionViewModel(session);
        sessions.push(sessionViewModel);
        sessionViewModel.start();
    });

    this.totalSessions = ko.computed(function () {
        return sessions().length;
    }, this);
    this.furthestStep = ko.computed(function () {
        return sessions().reduce(function (prior, session) {
            return Math.max(prior, session.maxStep());
        }, 0);
    }, this);

    function SessionViewModel(session) {
        var lastStep = ko.observable(0);

        this.start = function () {
            stepWatch = j.watch(session, [stepsInSession], function (step) {
                lastStep(step.step);
            });
        };
        this.maxStep = ko.computed(function () {
            return lastStep();
        }, this);
    }
};

var vm = new ViewModel();
ko.applyBindings(vm);
