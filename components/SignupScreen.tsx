import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { getProvinces, createPharmacyUser, getPharmacies } from '../api';
import { showAlert } from './utils'

export default function SignupScreen({ navigation }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [pharmacyItems, setPharmacyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [centerCode, setCenterCode] = useState('');

  useEffect(() => {
    setLoading(true);
    getProvinces()
      .then((data) => {
        const items = data.map((city) => ({
          value: city,
          name: city,
        }));
        setProvinceItems(items);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (city) {
      setLoading(true);
      getPharmacies({ areas: city })
        .then((data) => {
          const items = data.map((pharmacy) => ({
            value: pharmacy.id,
            name: pharmacy.name,
          }));
          setPharmacyItems(items);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [city]);

  function validate() {
    if (!pharmacy) {
      showAlert(
        'Los datos no son válidos',
        'Por favor, selecciona tu farmacia'
      );
      return;
    }
    if (!centerCode) {
      showAlert(
        'Los datos no son válidos',
        'Por favor, introduce el código autonómico de la farmacia'
      );
      return;
    }
    if (!name) {
      showAlert(
        'Los datos no son validos',
        'Por favor, introduce tu nombre y tus apellidos'
      );
      return;
    }
    if (!email) {
      showAlert('Los datos no son válidos', 'Por favor, introduce un email');
      return;
    }
    if (!password) {
      showAlert(
        'Los datos no son válidos',
        'Por favor, introduce una contraseña'
      );
      return;
    }
    return true;
  }
  function submitUser() {
    if (!validate()) {
      return;
    }

    createPharmacyUser({
      name,
      email,
      password,
      centerCode,
      pharmacyId: pharmacy,
    })
      .then((user) => {
        showAlert(
          'Enviado correctamente',
          `Gracias ${user.name}. Ya puedes iniciar sesión y actualizar el inventario de tu farmacia.`,
          [
            {
              text: 'Aceptar',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch((e) => {
        showAlert('Ha ocurrido un error', String(e));
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        Pedir acceso como personal de farmacia
      </Text>
      <Text style={styles.formSubtitle}>
        Por el momento, solo un usuario por farmacia podrá informar del
        inventario de productos.
      </Text>
      <SearchableDropdown
        select
        inputHeight={48}
        onItemSelect={(item) => {
          setCity(item.value);
        }}
        containerStyle={styles.searchInput}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinceItems}
        textInputProps={{
          placeholder: loading ? 'Cargando...' : 'Selecciona una ciudad',
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <SearchableDropdown
        select
        inputHeight={48}
        disabled={!city}
        onItemSelect={(item) => {
          setPharmacy(item.value);
        }}
        containerStyle={styles.searchInput}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={pharmacyItems}
        textInputProps={{
          placeholder: loading ? 'Cargando...' : 'Selecciona tu farmacia',
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Código Autonómico Ej: F08006281"
        onChangeText={setCenterCode}
        defaultValue={centerCode}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Nombre y Apellidos"
        autoCompleteType="name"
        onChangeText={setName}
        defaultValue={name}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={setEmail}
        defaultValue={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.formInput}
        placeholder="Contraseña"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
        onChangeText={setPassword}
        defaultValue={password}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.loginButton} onPress={submitUser}>
        <Text>Pedir acceso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 48,
    maxWidth: 600,
    backgroundColor: '#F5F5F5',
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  formSubtitle: {
    marginBottom: 16,
  },
  formInput: {
    height: 48,
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    width: '100%',
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  itemsContainer: {
    maxHeight: 140,
    marginTop: -14,
    marginBottom: 8,
    borderRadius: 5,
    zIndex: 1,
  },
  formLink: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#F5F5F5',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
