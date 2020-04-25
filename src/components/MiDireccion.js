import React from 'react';

import {copyToClipboard} from '../utils/funciones.js';

const MiDireccion = (props) => {

	return (
		<p>
			Mi dirección: {props.miDireccion}
			<button type="button" className="btn btn-outline-primary btn-copy" onClick={() => copyToClipboard(props.miDireccion)}>
				<i className="far fa-copy fa-lg"></i>
			</button>
			{
				props.miDireccion === props.owner
				?
				<span class="badge badge-primary">owner</span>
				:
				""
			}
		</p>
	);

}

export default MiDireccion;