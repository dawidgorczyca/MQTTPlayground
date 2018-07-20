import React from "react";
import { connect } from "react-redux";
import "./GpsDataTable.css";
import { fetchAreaPointsForDriver } from "../../store/actions/tracking.actions";

class GpsDataTable extends React.Component {
  componentWillReceiveProps(newProps) {
    if (newProps.driverId !== this.props.driverId) {
      this.props.fetchAreaPointsForDriver(newProps.driverId);
    }
  }

  render = () => {
    const matchedPointsData = this.props.matchedPoints.map((el, index) => (
      <tr key={index}>
        <td>{el[0]}</td>
        <td>{el[1]}</td>
        <td>{el[3] ? "Yes" : "No"}</td>
      </tr>
    ));

    return (
      <table className={matchedPointsData.length ? "" : "hidden"}>
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Is in the area?</th>
          </tr>
        </thead>
        <tbody>{matchedPointsData}</tbody>
      </table>
    );
  };
}

const mapStateToProps = state => ({
  matchedPoints: state.tracking.points
});

export default connect(
  mapStateToProps,
  { fetchAreaPointsForDriver }
)(GpsDataTable);
