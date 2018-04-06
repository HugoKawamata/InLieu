/*global google*/
import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import { Header, Form, Rating, Segment, Input, Button, Icon } from "semantic-ui-react";

interface Props {
  fdb: firebase.database.Database;
}

interface State {
  aestheticRating: number;
  cleanlinessRating: number;
  quietnessRating: number;
  toilet: object;
}

export default class ReviewToilet extends React.PureComponent<Props, State> {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props: Props) {
    super(props);
    // Un-set values are -1
    this.state = {
      aestheticRating: -1,
      cleanlinessRating: -1,
      quietnessRating: -1,
      toilet: {}
    }
  }

  componentDidMount() {
    let toiletID = this.context.router.route.location.pathname.slice(19);
    this.props.fdb.ref("toilets").child(toiletID)
    .on('value', (toilet) => {
      if (toilet) {
        this.setState({ toilet: toilet.val() });
      }
    });
  }

  componentWillUnmount() {
    let toiletID = this.context.router.route.location.pathname.slice(19);
    this.props.fdb.ref("toilets").child(toiletID).off();
  }

  // Semantic Ratings have no name, so use a className instead to uniquely ID inputs
  handleRate = (e: React.MouseEvent<HTMLDivElement>, { className, rating }: any) => {
    let obj = {};
    obj[className] = rating;
    this.setState(obj);
  }

  formIsValid = () => {
    return !(
      this.state.aestheticRating === -1 ||
      this.state.cleanlinessRating === -1 ||
      this.state.quietnessRating === -1
    );
  }

  submitReview = () => {
    if (!this.formIsValid()) {

    } else {
      let avgAesthetic = (this.state.aestheticRating + this.state.toilet["criteria"]["aesthetic"]["rating"]) / (this.state.toilet["numberOfReviews"] + 1);
      let avgCleanliness = (this.state.cleanlinessRating + this.state.toilet["criteria"]["cleanliness"]["rating"]) / (this.state.toilet["numberOfReviews"] + 1);
      let avgQuietness = (this.state.quietnessRating + this.state.toilet["criteria"]["quietness"]["rating"]) / (this.state.toilet["numberOfReviews"] + 1);
      let data = {
        criteria: {
          aesthetic: {rating: avgAesthetic},
          cleanliness: {rating: avgCleanliness},
          quietness: {rating: avgQuietness},
        },
        numberOfReviews: this.state.toilet["numberOfReviews"] + 1
      }

      console.log(data);
      
      let toiletID = this.context.router.route.location.pathname.slice(19);
      this.props.fdb.ref("toilets").child(toiletID).update(data)
    }
  }

  render() {
    const sexIcon = this.state.toilet["sex"] === "m" ? "male" : this.state.toilet["sex"] === "f" ? "female" : "intergender";
    const floorInfo = this.state.toilet["multistorey"] === 1 ? 
      (
        <div>
          Floor: {this.state.toilet["floor"]}
        </div>
      ) :
      <div/>;
    return (
      <Segment attached="bottom" className="review-toilet">
        <Header>
          {this.state.toilet["address"]}
        </Header>
        <div>
            <Icon name={sexIcon} />
            {this.state.toilet["accessible"] === 1 ? <Icon name="handicap" /> : ""}
            {this.state.toilet["paperTowels"] === 1 ? <Icon name="sticky note outline"/> : ""}
        </div>
        {floorInfo}
        <div>
          Stalls: {this.state.toilet["numStalls"]}
        </div>
        <Form>
          <Form.Group inline={true}>
            <label>Aesthetic: </label>
            <Rating
              icon="star"
              className="aestheticRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Cleanliness: </label>
            <Rating
              icon="star"
              className="cleanlinessRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Quietness: </label>
            <Rating
              icon="star"
              className="quietnessRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Button className="positive" onClick={this.submitReview}>
            Submit
          </Form.Button>
          {/* TODO: Make this actually "go back" rather than forward to home */}
          <Link to="/app/review">
            <Form.Button>
              Back
            </Form.Button>
          </Link>
        </Form>
      </Segment>
    );
  }
}