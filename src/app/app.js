import angular from 'angular';
import $ from 'jquery';

import '../style/app.css';

let svgImageView = () => {
  return {
    template: require('./svgView.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

let employeeInfoView = () => {
  return {
    template: require('./employeeView.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($scope) {
    this.colorComponent = ($event) => {
      var currentTarget = $event.currentTarget;
      var svgShapeElement = $(currentTarget).find(".svgShape");
      svgShapeElement[0].setAttribute("fill","yellow");
    }

    this.editContent = ($event) => {
      $event.stopPropagation();
      $event.currentTarget.contentEditable = true;
    }

    $scope.view = "svgView";
    $scope.changeView = (viewName) => { $scope.view = viewName; }

    
    var dragSrcEl = null;

    function handleDragStart(e) {
      this.style.opacity = '0.4';  // this / e.target is the source node.
      dragSrcEl = this;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }

    function handleDragEnter(e) {
      // this / e.target is the current hover target.
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over');  
    }

    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
      // Don't do anything if dropping the same employee we're dragging.
      if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        dragSrcEl.style.opacity = "1";
        this.innerHTML = e.dataTransfer.getData('text/html');
      }
      return false;
    }

    function handleDragEnd(e) {
      [].forEach.call(rows, function (col) {
        col.classList.remove('over');
      });
    }

    var rows = document.querySelectorAll('.employee');
    [].forEach.call(rows, function(row) {
      row.addEventListener('dragstart', handleDragStart, false);
      row.addEventListener('dragenter', handleDragEnter, false);
      row.addEventListener('dragover', handleDragOver, false);
      row.addEventListener('dragleave', handleDragLeave, false);
      row.addEventListener('drop', handleDrop, false);
      row.addEventListener('dragend', handleDragEnd, false);
    });
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('svgImageView', svgImageView)
  .directive('employeeInfoView', employeeInfoView)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;