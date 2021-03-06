'use String';

var React = require('react-native');
var SearchResults = require('./SearchResults')

var {
  Animation,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  ListView,
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
  componentDidMount(){
  }

  constructor(props){
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    this.state = {
      searchString: '19446',
      isLoading: false,
      message: '',
      latitude: 0,
      longitude: 0,
      address: '',
      dataSource: dataSource.cloneWithRows([]),
      pressed: 0
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

  onSearchPressed() {
    var queryString = this.state.searchString.split(' ').join("%20");
    var query = "http://maps.googleapis.com/maps/api/geocode/json?address="+queryString;
    this._executeQuery(query);
  }

  _handleResponse(response) {
    this.setState({isLoading: false});
    if (response.results.length == 1) {
      this.state.latitude = response.results[0].geometry.location.lat;
      this.state.longitude = response.results[0].geometry.location.lng;
      var obj = {};
      obj['latitude'] = this.state.latitude;
      obj['longitude'] = this.state.longitude;

      this._getImages(obj);
    } else {
      var dataSource = new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});

      this.setState({dataSource: dataSource.cloneWithRows(response.results)});
    }
  }

  _getImages(coords){

    var self = this;
    fetch("http://atm.samiulhuq.com/atm/get/?longitude="+coords.longitude+"&latitude="+coords.latitude)
      .then(response => response.json())
      .then(function(data){
        var dataSource = new ListView.DataSource(
        {rowHasChanged: (r1, r2) => r1.formatted_address !== r2.formatted_address});

        self.props.navigator.push({
          title: 'Snapshots nearby',
          component: SearchResults,
          passProps: {listings: data}
        });
      })
    .catch(error =>
        console.log(err)
     );
  }

  onSearchTextChanged(event){
    this.setState({searchString: event.nativeEvent.text});

    var queryString = this.state.searchString.split(' ').join("%20");
    var query = "http://maps.googleapis.com/maps/api/geocode/json?address="+queryString;

    if (this.state.searchString.length >= 3){
      this._executeQuery(query);
    }
  }

  renderRow(rowData, sectionID, rowID) {
    var obj = {};
    obj['latitude'] = rowData.geometry.location.lat;
    obj['longitude'] = rowData.geometry.location.lng;

    return (
      <TouchableHighlight
          style={{height:50}}
          onPress={() => this._getImages(obj)}
          underlayColor='#dddddd'>
        <View>
          <Text>{rowData.formatted_address}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render(){
    var spinner = this.state.isLoading ?
      (<ActivityIndicatorIOS hidden='true' size='large'/>) :
      (<View/>);
    return (
      <View ref="this" style={styles.container}>
        <View style={styles.flowRight}>
          <TextInput style={styles.searchInput} onChange={this.onSearchTextChanged.bind(this)} value={this.state.searchString} placeholder="Search via name or post code"/>
          <TouchableHighlight style={styles.button}
            onPress={this.onSearchPressed.bind(this)}
            underlayColor="#99d9f4">
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.description}>{this.state.message}</Text>
      <View style={{borderWidth: 0, borderColor: 'red', marginVertical: 0}}>
        <ListView 
          automaticallyAdjustContentInsets={false}
          style={{height: 200}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}/>
      </View>
      </View>
        );
  }
}

module.exports = SearchPage;
