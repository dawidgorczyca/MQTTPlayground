import { FETCH_AREA_POINTS } from '../action.types';
import { areaPointsForDriverHaveBeenFetched } from '../actions/tracking.actions';
import { restService } from '../../services/rest.service';
import { POINTS_AFTER_MATCHING } from '../rest.methods';

export default store => next => async action => {
  if (action.type === FETCH_AREA_POINTS) {
    const points = await restService.get(`${POINTS_AFTER_MATCHING}/${action.driver}`);
    store.dispatch(areaPointsForDriverHaveBeenFetched(points));
  }
  next(action)
}