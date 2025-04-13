
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ productName }) => {
  return (
    <nav className="mb-8">
      <ol className="flex">
        <li className="flex items-center">
          <Link to="/" className="text-gray-500 hover:text-exclusive-red">Home</Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
        </li>
        <li className="flex items-center">
          <Link to="/products" className="text-gray-500 hover:text-exclusive-red">Products</Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
        </li>
        <li className="text-gray-900">{productName}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
