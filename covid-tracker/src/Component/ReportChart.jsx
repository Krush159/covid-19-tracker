import React from 'react'
import Select from 'react-select';
import axios from 'axios';
import "./Report.css";
import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap';
// import * as V from 'victory';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
// import CountUp from 'react-countup'

export default class Report extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            global: "",
            countries: [],
            select: [],
            isGlobal: false,
            country: "Global",
            data: [],
            casesPerDay: [],

        }

    }
    async componentDidMount() {
        const { select } = this.state

        await axios
            .get("https://api.covid19api.com/summary")
            .then(res => {
                this.setState({
                    global: res.data.Global
                })
                this.setState({
                    countries: res.data.Countries
                })
                select.push({
                    label: "Global",
                    value: "Global",
                    confirm: res.data.Global.TotalConfirmed,
                    recover: res.data.Global.TotalRecovered,
                    deaths: res.data.Global.TotalDeaths
                })
                res.data.Countries.map((item, i) => {
                    select.push({
                        label: item.Country,
                        value: item.Country,
                        confirm: item.TotalConfirmed,
                        recover: item.TotalRecovered,
                        deaths: item.TotalDeaths
                    })
                })
                this.setState({
                    select: select
                })

            })




    }
    display = async country => {
        const { data, casesPerDay } = this.state
        if (data.length !== 0 && casesPerDay.length !== 0) {
            data.splice(0, data.length)
            casesPerDay.splice(0, casesPerDay.length)
        }
        this.setState({
            isGlobal: true,
            data: [],
            casesPerDay: []

        })
        this.setState({ country })

        var name = country.label
        await axios
            .get("https://api.covid19api.com/total/country/" + name)
            .then(res => {

                res.data.map((item, i) => {
                    casesPerDay.push({ x: new Date(item.Date).toDateString(), y: item.Confirmed })
                    data.push({
                        label: item.Country,
                        date: new Date(item.Date).toDateString(),
                        confirm: item.Confirmed,
                        recover: item.Recovered,
                        deaths: item.Deaths
                    })
                })
            })
        console.log(casesPerDay)
        this.setState({
            data: data,
            casesPerDay: casesPerDay
        })

    }

    render() {
        const { isGlobal, global, select, country, data, casesPerDay } = this.state
        console.log(data)
        return (
            <>
                <div className="container d-flex flex-column">

                    <div className="row mb-3">
                        <div className="col-md-4"></div>
                        <div className="col-md-4 text-left">
                            <Select options={select}
                                placeholder="Global"
                                value={country}
                                onChange={this.display} />
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                    <div className={"row rounded"} style={{ "backgroundColor": "white", "borderRadius":"30px" }}>
                        <div className={"col-md-3 d-flex flex-md-column flex-column justify-content-center align-items-center p-4"} style={{ "backgroundColor": "#5c6577" }}>
                            <Card className={"m-2  rounded card"} style={{ "width": "15rem", "backgroundColor": "#434a58" }}>
                                <CardHeader tag="h4" style={{ color: "white", fontWeight: "bold", padding: 5 }}>CONFIRMED</CardHeader>
                                <CardBody style={{ backgroundColor: "#032670", padding: 5 }}>
                                    <CardTitle style={{ color: "white", fontSize: 30 }}>{isGlobal ? country.confirm : global.TotalConfirmed }</CardTitle>
                                </CardBody>
                            </Card>
                            <Card className={"m-2 rounded card"} style={{ "width": "15rem", "backgroundColor": "#434a58" }}>
                                <CardHeader tag="h4" style={{ color: "white", fontWeight: "bold", padding: 5 }}>RECOVERED</CardHeader>
                                <CardBody style={{ backgroundColor: "green", padding: 5 }}>
                                    <CardTitle style={{ color: "white", fontSize: 30 }}>{isGlobal ? country.recover : global.TotalRecovered}</CardTitle>
                                </CardBody>
                            </Card>
                            <Card className={"m-2 rounded card"} style={{ "width": "15rem", "backgroundColor": "#434a58" }}>
                                <CardHeader tag="h4" style={{ color: "white", fontWeight: "bold", padding: 5 }}>DEATH</CardHeader>
                                <CardBody style={{ backgroundColor: "red", padding: 5 }}>
                                    <CardTitle style={{ color: "white", fontSize: 30 }}>{isGlobal ? country.deaths : global.TotalDeaths}</CardTitle>
                                </CardBody>
                            </Card>
                        </div>
                        <div className={"col-md-9 p-4"} style={{ "backgroundColor": "white" }}>
                            <div >
                                <AreaChart width={800} height={420} data={isGlobal?data:global}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#032670" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#032670" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="green" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fc0505" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#fc0505" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="confirm" stroke="#032670" fillOpacity={1} fill="url(#colorUv)" />
                                    <Area type="monotone" dataKey="recover" stroke="green" fillOpacity={1} fill="url(#colorPv)" />
                                    <Area type="monotone" dataKey="deaths" stroke="#fc0505" fillOpacity={1} fill="url(#colorRv)" />
                                </AreaChart>
                            </div>
                        </div>
                    </div>

                </div>


            </>
        )
    }
}