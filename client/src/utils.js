import moment from "moment";
import _ from "lodash";

const Utils = {};

Utils.formatDate = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("DD/MM/YYYY");
};

Utils.formatDateLikeDb = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("YYYY-MM-DD");
};

Utils.formatTime = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("HH:mm");
};

Utils.mergeDateAndTime = (dateSource, timeSource) => {
  const dateString = Utils.formatDateLikeDb(dateSource);
  const timeString = Utils.formatTime(timeSource);
  const dateTimeString = `${dateString} ${timeString}`;
  return moment(dateTimeString);
};

Utils.pickNickName = nickNames => {
  if (!!nickNames) {
    return _.first(nickNames);
  }
}

Utils.formatUsersNicknames = nickNames => {
  if (!!nickNames) {
    return nickNames.map(Utils.pickNickName).join(", ");
  }
}

Utils.toRange = (num, rangeStart, rangeEnd, numRange = 100) => {
  return (num * (rangeEnd - rangeStart) / numRange) + rangeStart;
}

Utils.deepFind = (array, object, testFn) => {
  let foundObject = array[0];
  const findHelper = (array, object) => (
    array.some(elem => {
      if (Array.isArray(elem)) {
        return findHelper(elem, object);
      } else if (testFn(elem, object)) {
        foundObject = elem;
        return true;
      }
      return false;
    })
  );

  findHelper(array, object);
  return foundObject;
}

Utils.expectToExist = (fieldValue, fieldName) => {
  if (typeof fieldValue === "undefined" || fieldValue === null) {
    throw new Error(`Given ${!!fieldName ? "value" : fieldName} doesn't exist`);
  }
}

Utils.getBroughtAmount = item => {
  return _.sumBy(item.users, user => user.amount)
}

Utils.sortItemsByMissing = items => {
  return _.sortBy(items, item =>
    item.broughtAmount - item.neededamount
  );
}

Utils.sortItemsByOldItems = (origItems, oldItems) => {
  let result = [];
  let items = [...origItems];

  oldItems.forEach(oldItem => {
    let found = false;
    items = items.filter(item => {
      if (!found && item.name === oldItem.name) {
          result.push(item);
          found = true;
          return false;
      } else
        return true;
    });
  });
  return result;
}

export default Utils;