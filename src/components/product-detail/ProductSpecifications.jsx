
const ProductSpecifications = ({ specifications }) => {
  return (
    <div>
      <table className="w-full border-collapse">
        <tbody>
          {specifications && Object.entries(specifications).map(([key, value]) => (
            <tr key={key} className="border-b">
              <th className="py-3 px-4 text-left bg-gray-50 w-1/4 capitalize">{key}</th>
              <td className="py-3 px-4">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecifications;
