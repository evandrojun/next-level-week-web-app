import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import ibge from '../../../services/ibge';
import server from '../../../services/server';
import logo from '../../../assets/logo.svg';
import RegisterMap from '../../../components/RegisterMap';
import { Item, IbgeResponse, FormData } from '../../../utils/project_interfaces';

import './styles.css';

interface State {
  items: Array<Item>
  selectedItems: Array<number>
  ufs: Array<string>
  cities: Array<string>
  selectedUf: string,
  selectedCity: string,
  selectedPosition: [number, number]

  formData: FormData,
}

class RegisterPoint extends Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      items: [],
      selectedItems: [],
      ufs: [],
      selectedUf: '',
      cities: [],
      selectedCity: '',

      selectedPosition: [0, 0],

      formData: {
        name: '',
        email: '',
        whatsapp: '',
      }
    }

    this.handleUfSelection = this.handleUfSelection.bind(this);
    this.handleCitySelection = this.handleCitySelection.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSelectedPosition = this.setSelectedPosition.bind(this);
  }

  handleUfSelection(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    this.setState({ selectedUf: uf });

    ibge.get<Array<IbgeResponse>>(`/localidades/estados/${uf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);

      this.setState({ cities: cityNames });
    });
  }

  handleCitySelection(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    this.setState({ selectedCity: city });
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    this.setState({ formData: { ...this.state.formData, [name]: value } });
  }

  handleItemClick(id: number) {
    const alreadySelectedItem = this.state.selectedItems.findIndex(item => item === id);

    if (alreadySelectedItem >= 0) {
      const filteredItems = this.state.selectedItems.filter(item => item !== id);

      this.setState({ selectedItems: filteredItems });
    } else {
      this.setState({ selectedItems: [...this.state.selectedItems, id] });
    }
  }

  async handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = this.state.formData;
    const uf = this.state.selectedUf;
    const city = this.state.selectedCity;
    const [latitude, longitude] = this.state.selectedPosition;
    const items = this.state.selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    await server.post('points', data);
  }

  setSelectedPosition(latitude: number, longitude: number) {
    this.setState({ selectedPosition: [latitude, longitude] })
  }

  componentDidMount() {
    server.get('items').then(response => {
      this.setState({ items: response.data });
    });

    ibge.get<Array<IbgeResponse>>('/localidades/estados').then(response => {
      const stateInitials = response.data.map(uf => uf.sigla);

      this.setState({ ufs: stateInitials });
    });
  };

  render() {
    return (
      <div id="page-register-point">
        <header>
          <img src={logo} alt="Ecoleta" />

          <Link to="/">
            <FiArrowLeft />
            Voltar
          </Link>
        </header>

        <form onSubmit={this.handleSubmit}>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" onChange={this.handleInputChange} />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" onChange={this.handleInputChange} />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input type="text" name="whatsapp" id="whatsapp" onChange={this.handleInputChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <RegisterMap setSelectedPosition={this.setSelectedPosition} />

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>

                <select name="uf" id="uf" value={this.state.selectedUf} onChange={this.handleUfSelection}>
                  <option value="0">Selecione um estado (UF)</option>

                  {this.state.ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>

                <select name="city" id="city" value={this.state.selectedCity} onChange={this.handleCitySelection}>
                  <option value="0">Selecione uma cidade</option>

                  {this.state.cities.map(cities => (
                    <option key={cities} value={cities}>{cities}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {this.state.items.map(item => (
                <li
                  key={item.id}
                  onClick={() => this.handleItemClick(item.id)}
                  className={this.state.selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">
            Cadastrar ponto de coleta
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterPoint;
