function matrixConstructor(_colCount, _rowCount) {

        this.colCount = _colCount;
        this.rowCount = _rowCount;
        
        if ((_colCount == 4) && (_rowCount == 4)) {
                this.matrix = new Array(
                        new Array(1, 0, 0, 0), 
                        new Array(0, 1, 0, 0), 
                        new Array(0, 0, 1, 0), 
                        new Array(0, 0, 0, 1)
                );    
        } else {
                this.matrix = new Array();
                tempArrayCol = new Array();
                for (var _row=0; _row < _rowCount; _row++) {
                        tempArrayCol[_row] = 0;
                }
                        
                for (var _col=0; _col < _colCount; _col++) {
                        this.matrix[_col] = tempArrayCol;
                }
        }

        this.alertMatrix = function() { 
        
                var _output = '<table>';
                for (var _row=0; _row < _rowCount; _row++) {  
                        _output += "<tr>";   
                        for (var _col=0; _col < _colCount; _col++) {   
                                _output += '<td>'+this.matrix[_col][_row]+"&nbsp;</td>";
                        }
                        _output += "</tr>";
                } 
                _output += "</table>";  
                $('#message').html(_output);
        };    
                
        this.setRotationXMatrix = function(_alpha) {
                var _sin = Math.sin(_alpha);
                var _cos = Math.cos(_alpha);
                this.matrix = new Array(
                        new Array(1, 0, 0, 0), 
                        new Array(0, _cos, _sin, 0), 
                        new Array(0, -_sin, _cos, 0), 
                        new Array(0, 0, 0, 1)
                );  
        };
        
        this.setRotationZMatrix = function(_alpha) {
                var _sin = Math.sin(_alpha);
                var _cos = Math.cos(_alpha);
                this.matrix = new Array(
                        new Array(_cos, _sin, 0, 0), 
                        new Array(-_sin, _cos, 0, 0), 
                        new Array(0, 0, 1, 0), 
                        new Array(0, 0, 0, 1)
                );  
        };
        
        this.setTranslationMatrix = function(_tx, _ty, _tz) {
                this.matrix = new Array(
                        new Array(1, 0, 0, 0), 
                        new Array(0, 1, 0, 0), 
                        new Array(0, 0, 1, 0), 
                        new Array(_tx, _ty, _tz, 1)
                );  
        };
        
        this.setProjectionMatrix = function(_distance) {
                this.matrix = new Array(
                        new Array(1, 0, 0, 0), 
                        new Array(0, 1, 0, 0), 
                        new Array(0, 0, 1, 1/_distance), 
                        new Array(0, 0, 0, 0)
                );  
        };
        
        this.matrixMultiplication = function(_matrix2) {
                
                _matrix1 = this;
                
                if (_matrix2.colCount == _matrix1.rowCount) {
                        
                        _resultMatrix = new Array();
                        for (var _col=0; _col < _matrix1.colCount; _col++) {
                                _arrayCol = new Array();
                                for (var _row=0; _row < _matrix2.rowCount; _row++) {
                                        _sum = 0;
                                        for (var _i=0; _i < _matrix2.colCount; _i++) {
                                               _sum += _matrix2.matrix[_i][_row] * _matrix1.matrix[_col][_i];
                                        }
                                        _arrayCol[_row] = _sum;
                                }
                                _resultMatrix[_col] = _arrayCol;
                        }
                        this.matrix = _resultMatrix;
                }
                
        };

        return this;
}




function getTransformationMatrix(camera) {


        // vector d: camera position to target
        var _dx = camera.tx - camera.px;
        var _dy = camera.ty - camera.py;
        var _dz = camera.tz - camera.pz;
        
        // heavy humbug: cause the formula is not working correctly with _dz 0 we set it to -0.01
        if (_dz == 0) {
                _dz = -0.01;
        }
        
        // distance from camera to target in xy-plane
        var _dxy = Math.sqrt(_dx*_dx + _dy*_dy);   
        
        // rotation around z-axis (pan)
        if (_dy == 0) {
                var _rotateZ = 0;
        } else if (_dy > 0) {
                var _rotateZ = Math.atan(_dx/_dy);
        } else {
                var _rotateZ = Math.PI + Math.atan(_dx/_dy);
        }
        
        // rotation around x-axis (tilt)
        if (_dz == 0) {
                var _rotateX = 0;
        } else {                        
                var _rotateX = Math.atan(_dxy/_dz);  
        }
        
        
      //  $('#message').append('<br>_rotateZ:'+_rotateZ);  
      //  $('#message').append('<br>_rotateX:'+_rotateX); 

      
        // translation matrix
        var translationMatrix = new matrixConstructor(4,4);
        translationMatrix.setTranslationMatrix(-camera.px, -camera.py, -camera.pz);
        
        // rotation z matrix
        var rotationZMatrix = new matrixConstructor(4,4);
        rotationZMatrix.setRotationZMatrix(_rotateZ);
        
        // rotation x matrix
        var rotationXMatrix = new matrixConstructor(4,4);
        rotationXMatrix.setRotationXMatrix(_rotateX);
        
        // projection matrix
        var projectionMatrix = new matrixConstructor(4,4);
        projectionMatrix.setProjectionMatrix(camera.focus);
        
        // transformation matrix
        var transformationMatrix = new matrixConstructor(4,4);
        transformationMatrix.matrixMultiplication(translationMatrix); 
        transformationMatrix.matrixMultiplication(rotationZMatrix);    
        transformationMatrix.matrixMultiplication(rotationXMatrix);        
        transformationMatrix.matrixMultiplication(projectionMatrix); 
        
      //  transformationMatrix.alertMatrix();      
        
        return transformationMatrix;
        
}