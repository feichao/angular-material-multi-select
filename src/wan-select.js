(function() {
  'use strict';

  var app = angular
    .module('fc.wanSelect', [])
    .directive('wanSelect', WanSelect);

  var contains = function(container, contained) {
    var node;
    node = contained.parentNode;
    while (node !== null && node !== container) {
      node = node.parentNode;
    }
    return node !== null;
  };

  app.directive("outsideClick", [
    '$document', '$parse',
    function($document, $parse) {
      return {
        link: function($scope, $element, $attributes) {
          var onDocumentClick, scopeExpression;
          scopeExpression = $attributes.outsideClick;
          onDocumentClick = function(event) {
            if (!contains($element[0], event.target)) {
              $scope.$apply(scopeExpression);
            }
          };
          $document.on("click", onDocumentClick);
          $element.on("$destroy", function() {
            $document.off("click", onDocumentClick);
          });
        }
      };
    }
  ]);

  /**
   * @ngInject
   */
  function WanSelect() {

    var template = ['<div class="wan-select" outside-click="vm.hideSelect()">',
      '  <label>{{placeholder}}</label>',
      '  <md-button class="md-raised" ng-click="vm.showSelect()">{{vm.result}}</md-button>',
      '  <div class="ws-content" ng-class="{true: \'ws-content-show\', false: \'ws-content-hide\'}[vm.show]">',
      '    <div class="ws-select-shortcut">',
      '      <md-button class="md-raised ws-select-button" ng-click="vm.selectAll()">全选</md-button>',
      '      <md-button class="md-raised ws-select-button" ng-click="vm.selectNone()">全不选</md-button>',
      '      <md-button class="md-raised ws-select-button" ng-click="vm.selectToggle()">反选</md-button>',
      '      <div class="ws-clear"></div>',
      '    </div>',
      '    <hr>',
      '    <md-input-container md-no-float class="ws-search">',
      '      <md-button class="ws-clear-search" ng-click="vm.searchStr=\'\'">',
      '        清空',
      '      </md-button>',
      '      <input ng-model="vm.searchStr" class="ws-search-input" placeholder="搜索">',
      '    </md-input-container>',
      '    <div layout="row" layout-wrap class="ws-selected">',
      '      <span ng-show="selectedData.length === 0" class="ws-none-select">没有选择任何项</span>',
      '      <md-checkbox ng-checked="true" ng-click="vm.toggle($event, item, true)" ng-repeat="item in selectedData">',
      '        {{item}}',
      '      </md-checkbox>',
      '    </div>',
      '    <hr>',
      '    <div layout="row" class="ws-unselected" layout-wrap>',
      '      <span ng-show="vm.dataUnselected.length === 0" class="ws-none-select">没有项可供选择</span>',
      '      <md-checkbox ng-checked="false" ng-click="vm.toggle($event, item, false)" ng-repeat="item in vm.dataUnselected">',
      '        {{item}}',
      '      </md-checkbox>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    return {
      restrict: 'EA',
      scope: {
        sourceData: '=',
        selectedData: '=',
        placeholder: '@',
        selectChanged: '&'
      },
      template: template,
      controller: Controller,
      controllerAs: 'vm'
    };

    /**
     * @ngInject
     */
    function Controller($scope) {
      var vm = this;

      vm.result = '请选择';

      vm.dataUnselected = $scope.sourceData;
      vm.searchStr = '';

      $scope.$watch('vm.searchStr', function(newVal, oldVal) {
        search(newVal || '');
      });

      $scope.$watchCollection('selectedData', function(newVal, oldVal) {
        vm.setSearchResult();
        if($scope.selectChanged && typeof($scope.selectChanged) === 'function'){
          $scope.selectChanged();
        }
      });

      function search(val) {
        val = val.toUpperCase();
        var tempSelected = $scope.selectedData.map(function(dt) {
          return dt.toUpperCase();
        });
        vm.dataUnselected = $scope.sourceData.filter(function(dt) {
          dt = dt.toUpperCase();
          return dt.indexOf(val) > -1 && tempSelected.indexOf(dt) === -1;
        });
      }

      vm.hideSelect = function() {
        vm.show = false;
      };

      vm.showSelect = function() {
        if(vm.show) {
          vm.show = false;
          return;
        }
        vm.show = true;
        vm.searchStr = '';

        vm.dataUnselected = $scope.sourceData.filter(function(dt) {
          return $scope.selectedData.indexOf(dt) === -1;
        });
      };

      vm.toggle = function(event, item, isExist) {
        event.stopPropagation();

        var idx;
        if (isExist) {
          idx = $scope.selectedData.indexOf(item);
          $scope.selectedData.splice(idx, 1);
          vm.dataUnselected.push(item);
        } else {
          idx = vm.dataUnselected.indexOf(item);
          vm.dataUnselected.splice(idx, 1);
          $scope.selectedData.push(item);
        }

        vm.setSearchResult();
      };

      vm.setSearchResult = function() {
        var length = $scope.selectedData.length;
        if (length === 1) {
          vm.result = $scope.selectedData[0];
        } else if (length === 0) {
          vm.result = '请选择';
        } else if (length === $scope.sourceData.length) {
          vm.result = '选择所有';
        } else {
          vm.result = '选择多个';
        }
      };

      vm.selectAll = function() {
        vm.result = '选择所有';
        $scope.selectedData = [].concat($scope.sourceData);
        vm.dataUnselected = [];
      };

      vm.selectNone = function() {
        vm.result = '请选择';
        vm.dataUnselected = [].concat($scope.sourceData);
        $scope.selectedData = [];
      };

      vm.selectToggle = function() {
        var temp = [].concat(vm.dataUnselected);
        vm.dataUnselected = [].concat($scope.selectedData);
        $scope.selectedData = temp;
        vm.setSearchResult();
      };
    }
  }

})();
