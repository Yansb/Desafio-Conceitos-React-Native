import React, {useState, useEffect} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(()=>{
    api.get('repositories').then(response=>{
      console.log(response.data);
      setRepositories(response.data);
    })
  },[]);
  
  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`);
    //essa função tive que procurar como fazer
    //mas ela basicamente salva todos os repositorios do array em uma variavel
    //"newRepositories" e entao ela vai procurando pela arrow function um 
    //repositorio que tenha o mesmo id que o id passado quando o botão foi 
    //clickado entao a arrow function retorna esse repositorio pra variavel 
    //com o valor alterado
    //e depois chama o setRepositories e envia todo um novo array para ocupar o
    //lugar do antigo
    const newRepositories = repositories.map(repository =>{
      if(repository.id === id){
        repository.likes += 1;
      }
      return repository;
    });

    setRepositories(newRepositories)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles}
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository})=>(
            <>
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} curtidas
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${repository.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
            </View>
          </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 28,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
