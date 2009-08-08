// Setup the timeline options
var timelineOptions = {
  title: "timeline title",
  id: "timeline1",
  autorun: false,
  events: [
    {
      datetime: 1230796800000,
      title: "Event 1 Title",
      description: "Event 1 Description"
    },
    {
      datetime: 1237273200000,
      title: "Event 2 Ttile",
      description: "Event 2 Description"
    }
  ],
};

var timeline = new EpochTimeline(timelineOptions);
