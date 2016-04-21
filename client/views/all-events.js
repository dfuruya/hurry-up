import React, {
  Text,
  View,
  Component,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import {getAllEvents, deleteEvent} from '../helpers/request-helpers';

const deviceWidth = Dimensions.get('window').width;

class AllEvents extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      userId: props.userId,
      clicked: false,
      indexClicked: null
    };
  }

  componentDidMount() {
    var that = this;
    getAllEvents(that);
  }

  buttonClicked() {
    //look into using websockets instead of refresh button / or state control
    var that = this;
    getAllEvents(that);
    this.render();
  }

  eventClicked(index) {
    this.setState({clicked: true, indexClicked: index});
    this.render();
  }

  onDelete(event) {
    deleteEvent(event);
    this.setState({clicked: false});
    this.buttonClicked();
    this.render();
  }

  displayTime(time) {
    var dateTime = time.toString();
    var hours = dateTime.substring(16,18);
    var postfix;
    if (Number(hours) > 12) {
      postfix = 'PM';
      hours = hours - 12;
    } else {
      postfix = 'AM';
    }
    var minutes = dateTime.substring(19,21);
    return hours + ':' + minutes + ' ' + postfix;
  }

  displayDuration(duration) {
    var minutes = Math.ceil(duration / 60);

    if (minutes < 60) {
      minutes = minutes.toString();
      return minutes + 'm';
    }

    if (minutes > 60) {
      var hours = Math.floor(minutes / 60);
      minutes = Math.ceil(minutes - hours * 60);
      minutes = minutes.toString();
      hours = hours.toString();
      return hours + 'h ' + minutes + 'm';
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {this.state.events.map((event, index) =>
            <View key={index}>
            <TouchableHighlight onPress={this.eventClicked.bind(this, index)}>
              <View style={styles.EventContainer}>
                <View style={styles.EventRow}>
                  <Text style={styles.EventTitle}>Event:</Text>
                  <View style={styles.EventInput}>
                    <Text style={styles.EventText}>{event.eventName} @ {this.displayTime(event.eventTime)} on {event.eventTime.substring(0,10)}</Text>
                  </View>
                </View>
                <View style={styles.EventRow}>
                  <Text style={styles.EventTitle}>Where: </Text>
                  <View style={styles.EventInput}>
                    <Text style={styles.EventText}>{event.address} {event.city} {event.state}</Text>
                  </View>
                </View>

                <View style={styles.EventRow}>
                  <Text style={styles.EventTitle}>Estimated Travel Time: </Text>
                  <View style={styles.EventInput}>
                    <Text style={styles.EventText}>{this.displayDuration(event.duration)}</Text>
                  </View>
                </View>

                <View style={styles.EventRow}>
                  <Text style={styles.EventTitle}>Getting there by: </Text>
                  <View style={styles.EventInput}>
                    <Text style={styles.EventText}>{event.mode}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            {(this.state.clicked && index === this.state.indexClicked)
              ? (<TouchableHighlight
                style={styles.button}
                onPress={this.onDelete.bind(this, event)}>
                <View>
                  <Text style={styles.buttonText}>Delete</Text>
                </View>
              </TouchableHighlight>)
              : (<View></View>)
            }
            </View>
          )}
          <Text style={styles.welcome}>no more events</Text>
        </ScrollView>
        <TouchableHighlight
          style={styles.button}
          onPress={this.buttonClicked.bind(this)}>
          <View>
            <Text style={styles.buttonText}>Refresh!</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  EventContainer: {
    flex: 1,
    margin: 7,
    padding: 15,
    height: 150,
    borderWidth: 0,
    borderColor: 'transparent',
    borderBottomColor: '#F5F5F6',
  },
  EventRow: {
    flex: 1,
    flexDirection:'row',
  },
  EventTitle: {
    margin: 5,
    fontSize: 14,
    color: '#ACB2BE',
    textDecorationLine: 'underline'
  },
  EventInput: {
    flex: 1,
    alignItems: 'flex-end',
  },
  EventText: {
    flex: 1,
    margin: 5,
    fontSize: 16,
    color: '#F5F5F6',
  },
  welcome: {
    margin: 20,
    fontSize: 20,
    color: '#ACB2BE',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue',
  },
  button: {
    padding: 15,
    width: deviceWidth,
    alignItems: 'center',
    backgroundColor: '#34778A',
  },
  buttonText: {
    fontSize: 16,
    color: '#F5F5F6',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light',
  },
});

export default AllEvents;
