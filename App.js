import React from 'react';
import { Image } from 'react-native';
import { Container, Header, Card, CardItem, Left, Text, Body, Right, Content, Icon, Button, Item, Input, Spinner, Thumbnail } from 'native-base';
import axios from 'axios';

class App extends React.Component {

  state = {
    search: "",
    apikey: "90b98b27ff68e36deee7bbf4147ca522",
    dataResto: "",
    isLoading: false
  }

  findRestaurant = () => {
    this.setState({
      isLoading: true
    });

    var url = `https://developers.zomato.com/api/v2.1/search?q=${this.state.search}`;

    var config = {
      headers: { 'user-key': `${this.state.apikey}` }
    };

    axios.get(url, config).then((x) => {
      if (x.data.restaurants.length > 0) {
        this.setState({
          dataResto: x.data.restaurants,
          isLoading: false
        });
      }

      else {
        //kenapa dataResto dikosongkan supaya saat user melakukan pencarian lagi, dan data restaurant gaada, hasil pencarian sebelumnya hilang. 
        this.setState({
          isLoading: false,
          dataResto: ""
        });
        alert("Maaf, kami tidak dapat menemukan makanan yang anda cari"); //jika data restaurant nya gaada
      }
    })

  }


  displayRestaurant() {
    return this.state.dataResto.map((val, i) => {
      return (
        <Card style={{ flex: 0, width: 350, alignSelf: "center", marginTop: 10 }} key={i}>
          <CardItem bordered>
            <Left>
              {/*jika gambar thumbnail restaurant gaada, dibuat default logo zomato. */}
              <Thumbnail style={{ maxWidth: 30, maxHeight: 30 }} square source={{ uri: val.restaurant.thumb ? val.restaurant.thumb : 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1506429243/skhqmbw3xxkfcuopf9yp.png' }} />
              <Body>
                <Text>{val.restaurant.name}</Text>
                <Text note>{val.restaurant.location.city}</Text>
              </Body>
            </Left>
            <Right>
              {/* harga dibagi dua untuk dapat value harga peorang */}
              <Text>Rp {(parseInt(val.restaurant.average_cost_for_two) / 2).toLocaleString()}</Text>
            </Right>
          </CardItem>
          <CardItem bordered>
            <Body>
              {/* jika gambar thumbnail restaurant gaada, tampilkan gambar default dgn tulisan "Gambar tidak tersedia" sesuai ss di soal. */}
              {val.restaurant.thumb ?
                <Image source={{ uri: val.restaurant.thumb }} style={{ height: 200, width: "100%", flex: 1 }} />
                :
                <Image source={require('./img/default.jpg')} style={{ height: 200, width: "100%", flex: 1 }} />
              }

            </Body>
          </CardItem>
          <CardItem bordered>
            <Left>
              <Icon name="pin" />
              <Text>{val.restaurant.location.address}</Text>
            </Left>
          </CardItem>
        </Card>
      )
    })
  }


  render() {
    return (

      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="search" />
            <Input placeholder="Cari menu makanan.." onChangeText={(e) => {
              this.setState({
                search: e
              })
            }}></Input>
          </Item>
        </Header>

        <Button full onPress={this.findRestaurant}>
          <Text>LIHAT DAFTAR RESTO</Text>
        </Button>

        <Content style={{ backgroundColor: "blue", flexDirection: "column" }}>
          {/* jika sedang loading, munculkan spinner. Jika loading selesai dan ada data resto, tampilkan hasil */}
          {this.state.isLoading ? <Spinner /> : this.state.dataResto ? this.displayRestaurant() : <Text></Text>}
        </Content>

      </Container>

    )
  }
}

export default App;
