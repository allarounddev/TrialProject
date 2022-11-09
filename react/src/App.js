import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation } from "react-router-dom";

import "./editor.css";
import "./narrow.css";

const App = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState();
    const [tableError, setError] = useState();


    const favoriteList = [];

    const List = ({ list, onRemove }) => (
        <ul className="list-group">
            {
                list.map((item) => (
                    <Item key={item.zipCode} item={item} onRemove={onRemove} />
                ))
            }
        </ul>
    );

    const Item = ({ item, onRemove }) => (
        <li className="list-group-item" onClick={onClickFetchData}>{item.locationName}-{item.zipCode}
            <button type="button" className="btn btn-default" onClick={() => onRemove(item.zipCode)} style={{ display: 'inline', float: 'right' }}>X
            </button>
        </li>

    );

    const listReducer = (state, action) => {
        switch (action.type) {
            case 'REMOVE_ITEM':
                return {
                    ...state,
                    list: state.list.filter((item) => item.zipCode !== action.zipCode),
                };
            case 'ADD_ITEM':
                let toBeAddedActionItem = {
                    zipCode: keyword,
                    locationName: weatherData.name
                };
                return {
                    ...state,
                    list: !state.list.find((object) => toBeAddedActionItem.zipCode === object.zipCode) && !state.list.find((object) => toBeAddedActionItem.locationName === object.locationName) ? state.list.concat(toBeAddedActionItem) : state.list,
                };
            default:
                throw new Error();
        }
    };
    const [listData, dispatchListData] = React.useReducer(listReducer, {
        list: favoriteList,
        isShowList: true,
    });

    if (!listData.isShowList) {
        return null;
    }

    const onClickFetchData = () => {
        setLoading(true)
        const fetchData = async () => {
            // please use your local ip address
            const url = "http://44.203.186.1/get_weather_by_zip/" + keyword;

            await axios.get(url)
                .then(response => {
                    if (response.status === 200) {
                        console.log(response.status)
                        console.log(response.data)
                        if (response.data.cod === '404') {
                            window.alert(response.data.message)
                        }
                        else {
                            setWeatherData(response.data);
                        }
                        setLoading(false)
                    }
                    else if (response.status === 404) {
                        console.log('okokokok')
                        console.log(response.status)
                    }
                })
                .catch(error => {
                    console.log(error.response.statusText)
                    window.alert(error.response.statusText)
                });
        }
        fetchData()
        console.log(weatherData)
    };

    const onChange = (e) => {
        setKeyword(e.target.value);
        console.log(e.target.value);
    }

    const addFavorite = (zipCode, locationName) => {
        dispatchListData({ type: 'ADD_ITEM', zipCode, locationName });
    }

    const deleteFavorite = (zipCode) => {
        dispatchListData({ type: 'REMOVE_ITEM', zipCode });
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active"></li>
                        <li className="nav-item"></li>
                        <li className="nav-item"></li>
                    </ul>
                    <div className="form-inline my-2 my-lg-0" _lpchecked="1">
                        <input className="form-control mr-sm-2" type="text" onChange={onChange} placeholder="Zip Code" aria-label="Zip Code" />
                        <button className="btn btn-outline-success my-2 my-sm-0" onClick={onClickFetchData}>Search</button>
                    </div>
                </div>
            </nav>
            {isLoading && weatherData == '' ? <LoadingSpinner /> :
                <footer className="footer">
                    <List list={listData.list} onRemove={deleteFavorite} />
                    <div className="card" style={{ marginTop: '30px' }}>
                        <div className="card" style={{ marginTop: '0px' }}>
                            <div className="card-body" style={{ marginTop: '0px' }}>
                                <h4 className="card-title">
                                    <b>{weatherData == '' ? 'Weather' : weatherData.name}</b>
                                </h4>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <h1>{weatherData == '' ? '0' : weatherData.main.temp}°</h1>
                                        <h6>{weatherData == '' ? '0' : weatherData.weather[0].description}</h6>
                                    </div>
                                    <div className="col-sm-4 col-5">
                                        <h3></h3>
                                    </div>
                                    <div className="col-sm-4">
                                        <h5>Pressure {weatherData == '' ? '0' : weatherData.main.pressure}</h5>
                                        <h5>Humidity {weatherData == '' ? '0' : weatherData.main.humidity}%</h5>
                                        <h5>Wind {weatherData == '' ? '0' : weatherData.wind.speed} mph</h5>
                                        <div className="row">
                                            <div className="col-sm-4"></div>
                                            <div className="col-sm-4 col-5"></div>
                                            <div className="col-sm-4"></div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={addFavorite}>Add to favorites</button>
                            </div>
                        </div>
                    </div>
                </footer>
            }
        </div>
    );
};

export default App;
