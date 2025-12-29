import { forwardRef } from 'react';
import { Download } from 'lucide-react';

const OrderReceipt = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const downloadReceipt = () => {
    // Convert the receipt to a downloadable format
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write('<html><head><title>Recibo de Compra</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        background: #fff;
        color: #000;
      }
      .header {
        text-align: center;
        border-bottom: 3px solid #facc15;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      .logo {
        font-size: 36px;
        font-weight: bold;
        color: #facc15;
      }
      .title {
        font-size: 24px;
        margin: 10px 0;
      }
      .section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .section-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        color: #333;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .product-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      .total-section {
        background: #f5f5f5;
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
      .total-final {
        font-size: 20px;
        font-weight: bold;
        padding-top: 10px;
        border-top: 2px solid #333;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #ddd;
        color: #666;
        font-size: 12px;
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(document.getElementById('receipt-content').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden">
      {/* Download Button */}
      <div className="p-4 bg-zinc-800 border-b border-yellow-500/20 flex justify-between items-center">
        <h3 className="text-lg font-bold text-yellow-500">📄 RECIBO DE COMPRA</h3>
        <button
          onClick={downloadReceipt}
          className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
        >
          <Download size={18} />
          Descargar Recibo
        </button>
      </div>

      {/* Receipt Content */}
      <div ref={ref} id="receipt-content" className="p-6">
        <div className="header">
          <div className="logo">🍺 DON CHUPILAS</div>
          <div className="title">Recibo de Compra</div>
          <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
            Tragos del Barrio - Entrega a Domicilio
          </p>
        </div>

        {/* Order Info */}
        <div className="section">
          <div className="section-title">📦 Información del Pedido</div>
          <div className="info-row">
            <span style={{ color: '#666' }}>Número de Pedido:</span>
            <strong style={{ color: '#000' }}>{order.numeroPedido}</strong>
          </div>
          <div className="info-row">
            <span style={{ color: '#666' }}>Fecha:</span>
            <strong style={{ color: '#000' }}>
              {new Date(order.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </strong>
          </div>
          <div className="info-row">
            <span style={{ color: '#666' }}>Estado:</span>
            <strong style={{ color: '#facc15', textTransform: 'capitalize' }}>
              {order.estado.replace('_', ' ')}
            </strong>
          </div>
          <div className="info-row">
            <span style={{ color: '#666' }}>Método de Pago:</span>
            <strong style={{ color: '#000', textTransform: 'capitalize' }}>
              {order.metodoPago}
            </strong>
          </div>
        </div>

        {/* Customer Info */}
        {order.cliente && (
          <div className="section">
            <div className="section-title">👤 Cliente</div>
            <div className="info-row">
              <span style={{ color: '#666' }}>Nombre:</span>
              <strong style={{ color: '#000' }}>{order.cliente.nombre}</strong>
            </div>
            {order.cliente.telefono && (
              <div className="info-row">
                <span style={{ color: '#666' }}>Teléfono:</span>
                <strong style={{ color: '#000' }}>{order.cliente.telefono}</strong>
              </div>
            )}
          </div>
        )}

        {/* Delivery Address */}
        <div className="section">
          <div className="section-title">📍 Dirección de Entrega</div>
          <p style={{ color: '#333', margin: 0 }}>
            {order.direccionEntrega.calle} {order.direccionEntrega.numero}
            {order.direccionEntrega.colonia && `, ${order.direccionEntrega.colonia}`}
            <br />
            {order.direccionEntrega.ciudad}
            {order.direccionEntrega.codigoPostal && ` - CP ${order.direccionEntrega.codigoPostal}`}
          </p>
          {order.direccionEntrega.referencias && (
            <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
              Referencia: {order.direccionEntrega.referencias}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="section">
          <div className="section-title">🛒 Productos</div>
          {order.productos.map((item, index) => (
            <div key={index} className="product-row">
              <div>
                <strong style={{ color: '#000', display: 'block' }}>{item.nombre}</strong>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {item.cantidad} x ${item.precio.toFixed(2)}
                </span>
              </div>
              <strong style={{ color: '#000' }}>
                ${(item.precio * item.cantidad).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        {/* Delivery Driver */}
        {order.repartidor && (
          <div className="section">
            <div className="section-title">🏍️ Repartidor</div>
            <div className="info-row">
              <span style={{ color: '#666' }}>Nombre:</span>
              <strong style={{ color: '#000' }}>{order.repartidor.nombre}</strong>
            </div>
            {order.repartidor.telefono && (
              <div className="info-row">
                <span style={{ color: '#666' }}>Teléfono:</span>
                <strong style={{ color: '#000' }}>{order.repartidor.telefono}</strong>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="total-section">
          <div className="total-row">
            <span>Subtotal:</span>
            <strong>${order.subtotal?.toFixed(2) || '0.00'}</strong>
          </div>
          <div className="total-row">
            <span>IVA (10%):</span>
            <strong>${order.impuestos?.toFixed(2) || '0.00'}</strong>
          </div>
          <div className="total-row">
            <span>Costo de Envío:</span>
            <strong>${order.costoEnvio?.toFixed(2) || '0.00'}</strong>
          </div>
          <div className="total-row total-final">
            <span>TOTAL:</span>
            <strong style={{ fontSize: '24px', color: '#facc15' }}>
              ${order.total.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>¡Gracias por tu compra, Don!</p>
          <p>DON CHUPILAS - Tragos del Barrio</p>
          <p>www.donchupilas.com | contacto@donchupilas.com</p>
          <p style={{ marginTop: '10px', fontSize: '11px' }}>
            Este recibo es un comprobante de tu pedido.<br />
            Conserva este documento para cualquier aclaración.
          </p>
        </div>
      </div>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt;
