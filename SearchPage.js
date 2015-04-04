'use String';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');

var {
  Animation,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});
class SearchPage extends Component {
  mixins:[TimerMixin];

  constructor(props){
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  }

  _executeQuery(query){
    this.setState({isLoading:true});
    var self = this;
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json))
      .catch(error =>
          this.setState({
            isLoading: false,
            message: 'Something bad happened: '+ error
          })
      );
  }

  onSearchPressed(){
    var queryString = this.state.searchString.split(' ').join("%20");
    var query = "http://maps.googleapis.com/maps/api/geocode/json?address="+queryString;
    this._executeQuery(query);
  }

  _handleResponse(response){
    this.setState({ isLoading: false, message: 'Whatsup'});
    console.log(response.results.length);
  }

  onSearchTextChanged(event){
    console.log('onSearchTextChanged')
    this.setState({searchString: event.nativeEvent.text});
    console.log(this.state.searchString);
  }

  render(){
    var spinner = this.state.isLoading ?
      (<ActivityIndicatorIOS hidden='true' size='large'/>) :
      (<View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for images near you!
        </Text>
        <Text style={styles.description}>
          Search for place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput style={styles.searchInput} onChange={this.onSearchTextChanged.bind(this)} value={this.state.searchString} placeholder="Search via name or post code"/>
          <TouchableHighlight style={styles.button}
            onPress={this.onSearchPressed.bind(this)}
            underlayColor="#99d9f4">
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button}
          underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={require('image!house')} style={styles.image}/>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
        );
  }
}

module.exports = SearchPage;
