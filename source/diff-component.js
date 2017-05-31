// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export const CLEAN = 'clean';
export const LOCAL = 'local';
export const REMOTE = 'remote';
export const CONFLICT = 'conflict';

type State = {
  status: string;
  initial: any,
  local: any,
  remote: any
}

export type diffComponentCtrl = {
  localChange: Function;
  subscribe: Function;
  remoteChange: Function;
  reset: () => void;
}

export function DiffComponentCtrl ($scope:Object) {
  'ngInject';

  this.$onInit = () => {
    var state: State = {
      status: CLEAN,
      initial: null,
      local: null,
      remote: null
    };

    const listeners: Array<Function> = [];

    this.getState = () => state;

    this.subscribe = fn => {
      listeners.push(fn);
      fn(state);
    };

    this.emit = x => listeners.forEach(fn => fn(x));

    this.localChange = x => {
      state.local = x;

      state = updateState(state);

      this.emit(state);
    };

    this.remoteChange = x => {
      if (!state.initial) {
        angular.extend(state, {
          initial: x,
          local: x,
          remote: x
        });

        return x;
      }

      state.remote = x;

      state = updateState(state);

      this.emit(state);

      return state.local;
    };

    this.reset = () => {
      if (state.status === REMOTE || state.status === CONFLICT)
        angular.extend(state, {
          status: CLEAN,
          local: state.remote,
          initial: state.remote
        });
      else
        angular.extend(state, {
          status: CLEAN,
          local: state.initial,
          remote: state.initial
        });

      this.emit(state);
    };

    this.diffContainerCtrl.register(this);
  };

  $scope.$on('$destroy', () => {
    this.diffContainerCtrl.deregister(this);
  });
}

export default {
  require: {
    diffContainerCtrl: '^diffContainer'
  },
  transclude: true,
  controller: DiffComponentCtrl,
  template:`
    <div ng-class="$ctrl.getState().status" ng-transclude></div>
  `
};

function updateState (state) {
  const dirtyLocal = state.initial !== state.local;
  const dirtyRemote = state.initial !== state.remote;
  const dirtyLocalRemote = state.local !== state.remote;

  if (dirtyLocal && dirtyRemote && dirtyLocalRemote)
    return angular.extend({}, state, {
      status: CONFLICT
    });
  else if (dirtyLocal && dirtyRemote)
    return angular.extend({}, state, {
      initial: state.remote,
      status: CLEAN
    });
  else if (dirtyLocal)
    return angular.extend({}, state, {
      status: LOCAL
    });
  else if (dirtyRemote)
    return angular.extend({}, state, {
      status: REMOTE
    });
  else
    return angular.extend({}, state, {
      status: CLEAN
    });
}
