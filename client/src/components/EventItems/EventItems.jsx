import _ from "lodash";
import React, { useState, useEffect } from "react";

import ItemsCard from "./ItemsCard";
import EditItemsCard from "./EditItemsCard";

import Utils from "../../utils";

const EventItems = props => {
  const {
    items,
    users,
    user,
    onChangeItemUserAmount,
    onAddItem,
    onEditSave
  } = props;

  const [isEditMode, setIsEditMode] = useState(false);
  const [isItemsSorted, setIsItemsSorted] = useState(true);
  const [fixedItems, setFixedItems] = useState([]);

  useEffect(() => {
    const oldItems = fixedItems;
    const extendedItems = items.map(item => {
      item.broughtAmount = Utils.getBroughtAmount(item);
      item.isMissing = item.broughtAmount < item.neededamount;
      return item;
    });

    const sortedItems = isItemsSorted ?
      Utils.sortItemsByMissing(extendedItems)
      : Utils.sortItemsByOldItems(extendedItems, oldItems);

    setFixedItems(sortedItems);
  }, [items]);

  const _onChangeItemUserAmount = (item, amount) => {
    setIsItemsSorted(false);
    onChangeItemUserAmount(item, amount);
  }

  const _onSortItems = () => {
    setFixedItems(Utils.sortItemsByMissing(fixedItems));
    setIsItemsSorted(true);
  }

  const _onEditSave = editedItems => {
    onEditSave(editedItems);
    setIsEditMode(false);
  }

  return (
    !isEditMode ?
      <ItemsCard
        items={fixedItems}
        users={users}
        user={user}
        isItemsSorted={isItemsSorted}
        onEnterEditMode={() => setIsEditMode(true)}
        onSortItems={_onSortItems}
        onChangeItemUserAmount={_onChangeItemUserAmount}
        onAddItem={onAddItem}
      />
    : <EditItemsCard
        onLeaveEditMode={() => setIsEditMode(false)}
        onEditSave={_onEditSave}
        items={fixedItems}
      />
  )
}

export default EventItems;
