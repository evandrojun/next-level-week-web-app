import React, { Component, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import ibge from '../../../services/ibge';
import server from '../../../services/server';
import logo from '../../../assets/logo.svg';
import RegisterMap from '../../../components/RegisterMap';
import { Item, IbgeResponse } from '../../../utils/project_interfaces';

import './styles.css';

interface State {
  items: Array<Item>
  ufs: Array<string>
  cities: Array<string>
  selectedUf: string,
  selectedCity: string,
}

class RegisterPoint extends Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      items: [],
      ufs: [],
      selectedUf: '',
      cities: [],
      selectedCity: '',
    }

    this.handleUfSelection = this.handleUfSelection.bind(this);
    this.handleCitySelection = this.handleCitySelection.bind(this);
  }

  handleUfSelection(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    this.setState({ selectedUf: uf });
  }

  handleCitySelection(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    this.setState({ selectedCity: city });
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

  componentDidUpdate() {
    server.get('items').then(response => {
      this.setState({ items: response.data });
    });

    ibge.get<Array<IbgeResponse>>(`/localidades/estados/${this.state.selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);

      this.setState({ cities: cityNames });
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

        <form>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input type="text" name="whatsapp" id="whatsapp" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <RegisterMap />

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
                <li key={item.id}>
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
