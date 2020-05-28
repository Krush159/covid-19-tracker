import React from 'react';

export default class DisplayChart extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <>
            ` <V.VictoryChart   width={900} height={550}>
                                    <V.VictoryLine 
                                        data={casesPerDay} 
                                        
                                        style={{
                                            data: { stroke: "#c43a31" },
                                            parent: { border: "1px solid #ccc"},
                                           
                                          }} />
                                </V.VictoryChart>`
            </>
        )
    }
}